const { Router } = require('express');
const { getLogs } = require('../controllers/audit.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', getLogs);
module.exports = router;