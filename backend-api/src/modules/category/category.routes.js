/**
 * Category Routes
 *
 * - Defines endpoints related to categories
 * - Maps routes to controller functions
 * - Includes Swagger documentation for API reference
 */

const router = require('express').Router();
const controller = require('./category.controller');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a category
 *     description: Create a new category under a category group
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryname
 *               - groupid
 *             properties:
 *               categoryname:
 *                 type: string
 *                 example: Fiction
 *               groupid:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 categoryid: 1
 *                 categoryname: Fiction
 *               message: Category has been created successfully.
 */
router.post('/', controller.createCategory);

/**
 * @swagger
 * /api/category/{groupId}:
 *   get:
 *     summary: Get categories by group
 *     description: Returns all active categories for a given category group
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Group ID
 *     responses:
 *       200:
 *         description: Category list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - categoryid: 1
 *                   categoryname: Fiction
 *                   availableproductcount: 10
 *               message: Categories retrieved successfully.
 */
router.get('/:groupId', controller.getCategoriesByGroupId);

/**
 * @swagger
 * /api/category/details/{categoryId}:
 *   get:
 *     summary: Get category by ID
 *     description: Returns category details with available product count
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 categoryid: 1
 *                 categoryname: Fiction
 *                 availableproductcount: 12
 *               message: Category details retrieved successfully.
 */
router.get('/details/:categoryId', controller.getCategoriesByCategoryId);


/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update category
 *     description: Update category details by category ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryname:
 *                 type: string
 *                 example: Science Fiction
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 categoryid: 1
 *                 categoryname: Science Fiction
 *               message: Category updated successfully.
 */
router.put('/:id', controller.updateCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Soft delete category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: null
 *               message: Category removed successfully.
 */
router.delete('/:id', controller.deleteCategory);
module.exports = router;
