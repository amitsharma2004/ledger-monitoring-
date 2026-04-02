/**
 * Global error handler — returns consistent JSON error format.
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const response = { error: err.message || 'Internal server error' };
  if (err.details) response.details = err.details;
  return res.status(status).json(response);
};

/**
 * Creates a structured HTTP error.
 */
const createError = (status, message, details = null) => {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
};

module.exports = { errorHandler, createError };