const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');
const { logAudit } = require('../middleware/audit.middleware');

/**
 * Budget service — uses actual table columns: id, category, amount,
 * period_start (DATE), period_end (DATE), created_at.
 * Period is derived from the YYYY-MM month string.
 */

/** Convert 'YYYY-MM' to { period_start: 'YYYY-MM-01', period_end: 'YYYY-MM-DD' } */
const monthToPeriod = (month) => {
  const [yr, mo] = month.split('-').map(Number)
  const period_start = `${month}-01`
  const period_end = new Date(yr, mo, 0).toISOString().split('T')[0]
  return { period_start, period_end }
}

/** Extract 'YYYY-MM' from a period_start date string */
const periodToMonth = (period_start) =>
  period_start ? String(period_start).substring(0, 7) : null

const setBudget = async ({ category, month, amount }, actor) => {
  const { period_start, period_end } = monthToPeriod(month)

  // Delete existing budget for same category + period, then insert fresh
  const { data: existing } = await supabase
    .from('budgets')
    .select('id')
    .eq('category', category)
    .eq('period_start', period_start)
    .maybeSingle()

  if (existing) {
    await supabase.from('budgets').delete().eq('id', existing.id)
  }

  const { data, error } = await supabase
    .from('budgets')
    .insert({ category, amount, period_start, period_end })
    .select()
    .single()

  if (error) throw createError(500, 'Failed to set budget: ' + error.message)
  await logAudit(actor, 'CREATE', 'budget', data.id, null, data)
  return { ...data, month }
}

const getBudgetVsActual = async (month) => {
  const targetMonth = month || new Date().toISOString().substring(0, 7)
  const { period_start, period_end } = monthToPeriod(targetMonth)

  // Fetch budgets for this period
  const { data: budgets, error: bErr } = await supabase
    .from('budgets')
    .select('*')
    .eq('period_start', period_start)

  if (bErr) throw createError(500, 'Failed to fetch budgets')

  // Fetch actual expense spending for the target month
  const { data: records, error: rErr } = await supabase
    .from('financial_records')
    .select('category, amount')
    .eq('type', 'expense')
    .gte('date', period_start)
    .lte('date', period_end)
    .is('deleted_at', null)

  if (rErr) throw createError(500, 'Failed to fetch records')

  // Aggregate actuals by category
  const actuals = {}
  for (const r of records) {
    actuals[r.category] = (actuals[r.category] || 0) + Number(r.amount)
  }

  // Build budget vs actual report
  const report = budgets.map(b => {
    const actual = actuals[b.category] || 0
    const variance = actual - Number(b.amount)
    const percentUsed = Number(b.amount) > 0 ? Math.round((actual / Number(b.amount)) * 100) : 0
    return {
      category: b.category,
      budgeted: Number(b.amount),
      actual,
      variance,
      percent_used: percentUsed,
      status: percentUsed > 100 ? 'over_budget' : percentUsed > 80 ? 'near_limit' : 'on_track',
    }
  })

  // Add unbudgeted categories with actual spending
  for (const [category, actual] of Object.entries(actuals)) {
    if (!budgets.find(b => b.category === category)) {
      report.push({
        category,
        budgeted: 0,
        actual,
        variance: actual,
        percent_used: null,
        status: 'unbudgeted',
      })
    }
  }

  return {
    month: targetMonth,
    total_budgeted: report.reduce((s, r) => s + r.budgeted, 0),
    total_actual: report.reduce((s, r) => s + r.actual, 0),
    categories: report.sort((a, b) => b.actual - a.actual),
  }
}

const listBudgets = async (month) => {
  let query = supabase.from('budgets').select('*').order('category')
  if (month) {
    const { period_start } = monthToPeriod(month)
    query = query.eq('period_start', period_start)
  }
  const { data, error } = await query
  if (error) throw createError(500, 'Failed to fetch budgets')
  return data.map(b => ({ ...b, month: periodToMonth(b.period_start) }))
}

module.exports = { setBudget, getBudgetVsActual, listBudgets }