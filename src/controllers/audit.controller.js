const auditService = require('../services/audit.service');

const getLogs = async (req, res, next) => {
  try {
    const { user_id, action, from, to, page, limit } = req.query;
    const result = await auditService.getLogs({ user_id, action, from, to, page, limit });
    return res.json(result);
  } catch (err) { next(err); }
};

module.exports = { getLogs };