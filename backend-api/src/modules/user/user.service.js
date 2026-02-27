const { json } = require('express');
const repo = require('./user.repository');
const bcrypt = require('bcryptjs');

/**
 * User Service
 *
 * - Contains business logic for users
 * - Delegates database operations to repository layer
 * - Keeps controllers clean and focused on HTTP handling
 */

/**
 * Create User
 *
 * - Calls repository to insert a new user
 * - @param {Object} data - { fullname, email, password }
 * @returns {Object} Created user
 */
exports.createUser = (data) => repo.createUser(data);

/**
 * Check if email exists
 *
 * - Calls repository to check if email exists
 * - @param {string} email - Email to check
 * @returns {boolean} True if email exists, false otherwise
 */
exports.isEmailExists = (email) => repo.isEmailExists(email);

/**
 * Get All Users
 *
 * - Calls repository to fetch all active users
 * - @returns {Array} List of users
 */
exports.getUsers = () => repo.getUsers();

/**
 * Update User
 *
 * - Calls repository to update a user by ID
 * - @param {number} id - User ID
 * - @param {Object} data - { fullname, email }
 * @returns {Object} Updated user
 */
exports.updateUser = (id, data) => repo.updateUser(id, data);

/**
 * Delete User (Soft Delete)
 *
 * - Calls repository to mark user as deleted
 * - @param {number} id - User ID
 */
exports.deleteUser = (id) => repo.deleteUser(id);

/**
 * Get User By ID
 *
 * - Calls repository to fetch a single user
 * - @param {number} id - User ID
 * @returns {Object} User details
 */
exports.getUserById = (id) => repo.getUserById(id);


/*
* User Login
*
* - Validates user credentials
* - Returns user data if valid
* - @param {Object} param0 - { email, password }
* - @returns {Object} User details
*/
exports.login = async ({ email, password }) => {

  // 1. Check user exists
  const user = repo.getUserByEmail(email, password);
  if (!user) {
    if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err; // ✅ throw
  }
  }
  // 2. Compare password
//   const isMatch = password === user.passwordhash;
//   if (!isMatch) {
//      throw new Error('Invalid email or password');
//   }
 
//   // 2. Compare password
//   const isMatch = await bcrypt.compare(password, user.passwordhash);
//   if (!isMatch) {
//     throw new Error('Invalid email or password');
//   }

//   // 3. Remove sensitive data
//   delete user.passwordhash;
  return user;
};