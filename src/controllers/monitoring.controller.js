const monitoringService = require('../services/monitoring.service');

const getSuspicious = async (req, res, next) => {
  try {
    const data = await monitoringService.getSuspicious();
    return res.json(data);
  } catch (err) { next(err); }
};

module.exports = { getSuspicious };