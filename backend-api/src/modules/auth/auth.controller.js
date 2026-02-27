/**
 * Authentication Controller
 *
 * - Handles user login requests
 * - Delegates business logic to authService
 * - Returns standardized API response
 */

const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Login Controller
 *
 * - Receives login credentials from request body
 * - Calls authService to authenticate user
 * - Sends success response if login is valid
 */
exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    // Send success response
    res.json(ApiResponse.success(data, 'Login successful'));
  } catch (err) {
    // Forward error to global error handler
    next(err);
  }
};
