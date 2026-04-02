const budgetService = require('../services/budget.service');
const { z } = require('zod');

const setBudget = async (req, res, next) => {
  try {
    const schema = z.object({
      category: z.string().min(1),
      month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be YYYY-MM'),
      amount: z.number().positive(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(parsed.error.errors.map(e => [e.path.join('.'), e.message]));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const budget = await budgetService.setBudget(parsed.data, req.user);
    return res.status(201).json({ budget });
  } catch (err) { next(err); }
};

const getBudgetVsActual = async (req, res, next) => {
  try {
    const data = await budgetService.getBudgetVsActual(req.query.month);
    return res.json(data);
  } catch (err) { next(err); }
};

const listBudgets = async (req, res, next) => {
  try {
    const data = await budgetService.listBudgets(req.query.month);
    return res.json({ budgets: data });
  } catch (err) { next(err); }
};

module.exports = { setBudget, getBudgetVsActual, listBudgets };