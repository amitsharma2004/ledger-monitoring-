const { Router } = require('express');
const { setBudget, getBudgetVsActual, listBudgets } = require('../controllers/budget.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = Router();
router.use(requireAuth);
router.get('/', listBudgets);
router.post('/', requireRole('admin'), setBudget);
router.get('/vs-actual', getBudgetVsActual);
module.exports = router;