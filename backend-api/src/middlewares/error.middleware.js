/**
 * Global Error Handler Middleware
 *
 * - Catches errors passed using next(err)
 * - Logs error details to the console
 * - Sends a standard JSON error response
 */

const logger = require("../utils/logger");
exports.errorHandler = (err, req, res, next) => {
  // Log error for debugging
  logger.error('❌ An error occurred', {
    message: err.message,
    stack: err.stack
  });
  // Send error response
  res.status(500).json({
    success: false,
    message: err.message || 'INTERNAL_SERVER_ERROR'
  });
};
