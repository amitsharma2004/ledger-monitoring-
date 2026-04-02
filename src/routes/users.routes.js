const { Router } = require('express');
const { listUsers, updateRole, updateStatus } = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/', listUsers);
router.patch('/:id/role', updateRole);
router.patch('/:id/status', updateStatus);

module.exports = router;