const { Router } = require('express');
const { createRecord, listRecords, updateRecord, updateCompliance, deleteRecord } = require('../controllers/records.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = Router();
router.use(requireAuth);

router.get('/', listRecords);
router.post('/', requireRole('admin'), createRecord);
router.patch('/:id', requireRole('admin'), updateRecord);
router.patch('/:id/compliance', requireRole('admin', 'analyst'), updateCompliance);
router.delete('/:id', requireRole('admin'), deleteRecord);

module.exports = router;