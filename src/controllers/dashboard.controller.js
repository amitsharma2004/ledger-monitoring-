const dashboardService = require('../services/dashboard.service');
const budgetService = require('../services/budget.service');

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const data = await dashboardService.getByCategory();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

const getRecent = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecent();
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

const getForecast = async (req, res, next) => {
  try {
    const data = await dashboardService.getForecast();
    return res.json(data);
  } catch (err) { next(err); }
};

const getBudgetVsActual = async (req, res, next) => {
  try {
    const data = await budgetService.getBudgetVsActual(req.query.month);
    return res.json(data);
  } catch (err) { next(err); }
};

module.exports = { getSummary, getByCategory, getTrends, getRecent, getForecast, getBudgetVsActual };