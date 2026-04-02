const { Router } = require('express');
const { getSummary, getByCategory, getTrends, getRecent, getForecast, getBudgetVsActual } = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.use(requireAuth);

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/trends', getTrends);
router.get('/recent', getRecent);
router.get('/forecast', getForecast);
router.get('/budget-vs-actual', getBudgetVsActual);

module.exports = router;