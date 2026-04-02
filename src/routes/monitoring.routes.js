const { Router } = require('express');
const { getSuspicious } = require('../controllers/monitoring.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = Router();
router.use(requireAuth, requireRole('admin', 'analyst'));
router.get('/suspicious', getSuspicious);
module.exports = router;