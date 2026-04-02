const { createError } = require('./error.middleware');

/**
 * Factory that returns middleware allowing only the specified roles.
 * Must be used after requireAuth.
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(createError(403, 'Forbidden: insufficient permissions'));
  }
  next();
};

module.exports = { requireRole };