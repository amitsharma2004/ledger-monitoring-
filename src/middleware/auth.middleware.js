const jwt = require('jsonwebtoken');
const { createError } = require('./error.middleware');

/**
 * Validates the Bearer JWT token in the Authorization header.
 * Attaches decoded user payload to req.user.
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'Authentication required'));
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createError(401, 'Invalid or expired token'));
  }
};

module.exports = { requireAuth };