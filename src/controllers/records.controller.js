const recordsService = require('../services/records.service');
const { createRecordSchema, updateRecordSchema } = require('../validators/records.validator');
const { z } = require('zod');

const createRecord = async (req, res, next) => {
  try {
    const parsed = createRecordSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(parsed.error.errors.map(e => [e.path.join('.'), e.message]));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const record = await recordsService.createRecord(req.user.id, parsed.data, req.user);
    return res.status(201).json({ record });
  } catch (err) { next(err); }
};

const listRecords = async (req, res, next) => {
  try {
    const { type, category, from, to, page, limit, compliance_status } = req.query;
    const result = await recordsService.listRecords({ type, category, from, to, page, limit, compliance_status });
    return res.json(result);
  } catch (err) { next(err); }
};

const updateRecord = async (req, res, next) => {
  try {
    const parsed = updateRecordSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(parsed.error.errors.map(e => [e.path.join('.'), e.message]));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const record = await recordsService.updateRecord(req.params.id, parsed.data, req.user);
    return res.json({ record });
  } catch (err) { next(err); }
};

const updateCompliance = async (req, res, next) => {
  try {
    const schema = z.object({ compliance_status: z.enum(['clean', 'flagged', 'under_review']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = Object.fromEntries(parsed.error.errors.map(e => [e.path.join('.'), e.message]));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    const record = await recordsService.updateCompliance(req.params.id, parsed.data.compliance_status, req.user);
    return res.json({ record });
  } catch (err) { next(err); }
};

const deleteRecord = async (req, res, next) => {
  try {
    const result = await recordsService.deleteRecord(req.params.id, req.user);
    return res.json(result);
  } catch (err) { next(err); }
};

module.exports = { createRecord, listRecords, updateRecord, updateCompliance, deleteRecord };