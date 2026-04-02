const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');

/**
 * Returns total income, total expenses, and net balance.
 */
const getSummary = async () => {
  const { data, error } = await supabase
    .from('financial_records')
    .select('type, amount')
    .is('deleted_at', null);

  if (error) throw createError(500, 'Failed to fetch summary');

  const totalIncome = data
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = data
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_balance: totalIncome - totalExpenses,
  };
};

/**
 * Returns totals grouped by category.
 */
const getByCategory = async () => {
  const { data, error } = await supabase
    .from('financial_records')
    .select('category, type, amount')
    .is('deleted_at', null);

  if (error) throw createError(500, 'Failed to fetch category breakdown');

  const grouped = {};
  for (const record of data) {
    const key = record.category;
    if (!grouped[key]) grouped[key] = { category: key, income: 0, expense: 0 };
    grouped[key][record.type] += Number(record.amount);
  }

  return Object.values(grouped).sort((a, b) => a.category.localeCompare(b.category));
};

/**
 * Returns monthly totals for income and expenses.
 */
const getTrends = async () => {
  const { data, error } = await supabase
    .from('financial_records')
    .select('type, amount, date')
    .is('deleted_at', null)
    .order('date', { ascending: true });

  if (error) throw createError(500, 'Failed to fetch trends');

  const monthly = {};
  for (const record of data) {
    const month = record.date.substring(0, 7); // YYYY-MM
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
    monthly[month][record.type] += Number(record.amount);
  }

  return Object.values(monthly);
};

/**
 * Returns the last 10 non-deleted transactions.
 */
const getRecent = async () => {
  const { data, error } = await supabase
    .from('financial_records')
    .select('*')
    .is('deleted_at', null)
    .order('date', { ascending: false })
    .limit(10);

  if (error) throw createError(500, 'Failed to fetch recent transactions');
  return data;
};

/**
 * Linear forecast: based on last 3 months of expense data,
 * project next month's expected spend per category.
 */
const getForecast = async () => {
  const now = new Date();
  const months = [];
  for (let i = 3; i >= 1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const { data: records, error } = await supabase
    .from('financial_records')
    .select('category, amount, date, type')
    .eq('type', 'expense')
    .gte('date', `${months[0]}-01`)
    .is('deleted_at', null);

  if (error) throw createError(500, 'Failed to fetch data for forecast');

  // Group by category and month
  const byCategory = {};
  for (const r of records) {
    const month = r.date.substring(0, 7);
    if (!byCategory[r.category]) byCategory[r.category] = {};
    byCategory[r.category][month] = (byCategory[r.category][month] || 0) + Number(r.amount);
  }

  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const forecast = [];
  for (const [category, monthData] of Object.entries(byCategory)) {
    const values = months.map(m => monthData[m] || 0);
    const nonZero = values.filter(v => v > 0);
    if (nonZero.length === 0) continue;

    // Linear regression (simple slope from first to last non-zero point)
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const trend = values.length >= 2 ? (values[values.length - 1] - values[0]) / (values.length - 1) : 0;
    const projected = Math.max(0, avg + trend);

    forecast.push({
      category,
      history: months.map((m, i) => ({ month: m, amount: values[i] })),
      projected_next_month: Math.round(projected * 100) / 100,
      next_month: nextMonth,
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
    });
  }

  return {
    forecast_month: nextMonth,
    based_on_months: months,
    categories: forecast.sort((a, b) => b.projected_next_month - a.projected_next_month),
    total_projected: Math.round(forecast.reduce((s, f) => s + f.projected_next_month, 0) * 100) / 100,
  };
};

module.exports = { getSummary, getByCategory, getTrends, getRecent, getForecast };