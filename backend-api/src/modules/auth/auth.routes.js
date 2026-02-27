/**
 * Authentication Routes
 *
 * - Defines authentication-related endpoints
 * - Maps routes to controller functions
 */

const router = require('express').Router();
const { login } = require('./auth.controller');

/**
 * Login Route
 *
 * POST /login
 * - Handles user login requests
 */
router.post('/login', login);
module.exports = router;
