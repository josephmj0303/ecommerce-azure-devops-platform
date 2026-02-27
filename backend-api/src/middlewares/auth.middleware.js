/**
 * Authorization Middleware (Basic)
 *
 * Purpose:
 * - Prevent access to protected routes
 * - Ensure Authorization header is present
 */

module.exports = (req, res, next) => {
  // Read Authorization header
  const token = req.headers.authorization;

  // If header is missing → block request
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Header exists → allow request
  next();
};
