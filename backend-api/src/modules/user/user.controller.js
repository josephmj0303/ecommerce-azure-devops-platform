const service = require('./user.service');
const ApiResponse = require('../../utils/apiResponse');
const { json } = require('express');
const { sendWelcomeEmail } = require('../../services/email.service');
/**
 * User Controller
 *
 * - Handles all HTTP requests related to users
 * - Delegates business logic to service layer
 * - Returns standardized API responses
 */

/**
 * Create User
 *
 * - Reads user data from request body
 * - Calls service to create user
 * - Sends success response with created user
 * - @route POST /api/user
 * - @param {Object} req.body - { fullname, email, passwordhash }
 * - @returns {Object} ApiResponse with created user
 */
exports.createUser = async (req, res, next) => {
  try {

    /* Check if email already exists */
    const { email } = req.body;
    const exists = await service.isEmailExists(email);
    if (exists) {
      return res.status(409).json(
        ApiResponse.failure('Email already exists. Please use another email.')
      );
    }

    /* Create user */
    const data = await service.createUser(req.body);
    res.json(ApiResponse.success(data, 'Your account has been created successfully.'));

    /* Send welcome email */
    await sendWelcomeEmail({
      email: data.email,
      fullname: data.fullname
    });


  } catch (err) {
    next(err);
  }
};

/**
 * Get All Users
 *
 * - Fetches all active users
 * - Calls service layer
 * - Returns success response with user list
 * - @route GET /api/user
 * - @returns {Array} ApiResponse with list of users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const data = await service.getUsers();
    res.json(ApiResponse.success(data, 'User list fetched successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Update User
 *
 * - Updates user details by user ID
 * - Reads user ID from request params
 * - Calls service to update
 * - Returns success response with updated user
 * - @route PUT /api/user/:id
 * - @param {string} req.params.id - User ID
 * - @param {Object} req.body - { fullname, email }
 * - @returns {Object} ApiResponse with updated user
 */
exports.updateUser = async (req, res, next) => {
  try {
    const data = await service.updateUser(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Your account details have been updated successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete User (Soft Delete)
 *
 * - Marks user as deleted
 * - Reads user ID from request params
 * - Calls service to perform soft delete
 * - Returns success response
 * - @route DELETE /api/user/:id
 * - @param {string} req.params.id - User ID
 * - @returns {Object} ApiResponse with deletion status
 */
exports.deleteUser = async (req, res, next) => {
  try {
    await service.deleteUser(req.params.id);
    res.json(ApiResponse.success(null, 'Your account has been removed successfully.'));
  } catch (err) {
    next(err);
  }
};


/**
 * Login User
  *
  * - Validates user credentials
  * - Reads email and password from request body
  * - Calls service to perform login
  * - Returns success response with auth data
  * - @route POST /api/user/login
  * - @param {string} req.body.email - User email
  * - @param {string} req.body.password - User password
  * - @returns {Object} ApiResponse with auth data
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await service.login({ email, password });
    if (!data) {
      return res.status(401).json(
        ApiResponse.failure('Invalid email or password.')
      );
    }else{
      res.json(ApiResponse.success(data, 'Login successful.'));
    }

  } catch (err) {
    next(err);
  }
};