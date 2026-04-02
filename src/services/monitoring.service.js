const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');

/**
 * Returns suspicious transactions using 3 detection algorithms:
 * 1. Unusually large (> 2x the average amount)
 * 2. Duplicate amounts within 24 hours in same category
 * 3. Category spike > 200% vs last month
 */
const getSuspicious = async () => {
  const { data: records, error } = await supabase
    .from('financial_records')
    .select('*')
    .is('deleted_at', null)
    .order('date', { ascending: false });

  if (error) throw createError(500, 'Failed to fetch records for monitoring');

  const results = { large_transactions: [], duplicates: [], category_spikes: [] };

  // ── Algorithm 1: Unusually large (> 2x average) ──────────────────────────
  if (records.length > 0) {
    const avg = records.reduce((s, r) => s + Number(r.amount), 0) / records.length;
    const threshold = avg * 2;
    results.large_transactions = records
      .filter(r => Number(r.amount) > threshold)
      .map(r => ({ ...r, reason: `Amount ${r.amount} exceeds 2x average (${avg.toFixed(2)})` }));
  }

  // ── Algorithm 2: Duplicate amounts within 24h same category ──────────────
  const seen = {};
  for (const r of records) {
    const key = `${r.category}-${r.amount}`;
    if (!seen[key]) { seen[key] = []; }
    seen[key].push(r);
  }
  for (const [key, group] of Object.entries(seen)) {
    if (group.length < 2) continue;
    const sorted = group.sort((a, b) => new Date(b.date) - new Date(a.date));
    for (let i = 0; i < sorted.length - 1; i++) {
      const diffMs = Math.abs(new Date(sorted[i].date) - new Date(sorted[i + 1].date));
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours <= 24) {
        if (!results.duplicates.find(d => d.id === sorted[i].id)) {
          results.duplicates.push({ ...sorted[i], reason: `Duplicate amount ${sorted[i].amount} in category '${sorted[i].category}' within 24h` });
        }
      }
    }
  }

  // ── Algorithm 3: Category spike > 200% vs last month ─────────────────────
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const thisMonthByCategory = {};
  const lastMonthByCategory = {};

  for (const r of records) {
    const month = r.date.substring(0, 7);
    if (month === thisMonth) {
      thisMonthByCategory[r.category] = (thisMonthByCategory[r.category] || 0) + Number(r.amount);
    }
    if (month === lastMonth) {
      lastMonthByCategory[r.category] = (lastMonthByCategory[r.category] || 0) + Number(r.amount);
    }
  }

  for (const [category, thisTotal] of Object.entries(thisMonthByCategory)) {
    const lastTotal = lastMonthByCategory[category] || 0;
    if (lastTotal > 0) {
      const changePercent = ((thisTotal - lastTotal) / lastTotal) * 100;
      if (changePercent > 200) {
        results.category_spikes.push({
          category,
          this_month: thisTotal,
          last_month: lastTotal,
          change_percent: Math.round(changePercent),
          reason: `Category '${category}' spending up ${Math.round(changePercent)}% vs last month`,
        });
      }
    }
  }

  return {
    summary: {
      large_transactions: results.large_transactions.length,
      duplicates: results.duplicates.length,
      category_spikes: results.category_spikes.length,
      total_alerts: results.large_transactions.length + results.duplicates.length + results.category_spikes.length,
    },
    ...results,
  };
};

module.exports = { getSuspicious };