const router = require('express').Router();
const controller = require('./user.controller');

/**
 * User Routes
 *
 * - Defines all API endpoints related to User
 * - Maps each endpoint to corresponding controller function
 * - Supports CRUD operations
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the system
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - passwordhash
 *               - userType
 *               - vendorNumber
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               passwordhash:
 *                 type: string
 *                 example: 123456
 *               userType:
 *                 type: string
 *                 example: Customer
 *               vendorNumber:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 userid: 1
 *                 fullname: John Doe
 *                 email: john@example.com
 *               message: Your account has been created successfully.
 */
router.post('/', controller.createUser);


/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', controller.login);


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all active users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - userid: 1
 *                   fullname: John Doe
 *                   email: john@example.com
 *               message: List of all users retrieved successfully.
 */
router.get('/', controller.getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update user's fullname and email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Smith
 *               email:
 *                 type: string
 *                 example: johnsmith@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 userid: 1
 *                 fullname: John Smith
 *                 email: johnsmith@example.com
 *               message: Your account details have been updated successfully.
 */
router.put('/:id', controller.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Soft delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: null
 *               message: Your account has been removed successfully.
 */
router.delete('/:id', controller.deleteUser);
module.exports = router;


