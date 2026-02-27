/**
 * Category Group Routes
 *
 * These APIs help manage main product sections
 * in the online stationery store.
 *
 * Category Groups are used to organize products like:
 *  - Books
 *  - Office Supplies
 *  - Writing Items
 *  - Art & Craft Materials
 *
 * Admin can:
 *  - Add new product groups with images
 *  - View all available groups
 *  - Edit group details
 *  - Remove groups from the store
 */

const router = require('express').Router();
const controller = require('./categoryGroup.controller');
const {
  uploadCategoryGroupImage
} = require('../../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   - name: CategoryGroup
 *     description: |
 *       Manage main product groups used in the stationery store.
 *       These groups help customers easily browse products.
 */

/**
 * @swagger
 * /api/categorygroup:
 *   post:
 *     summary: Add a new product group
 *     description: |
 *       This API allows the admin to create a new product group
 *       such as "Books" or "Office Supplies".
 *       An image can be added to display the group on the website.
 *     tags:
 *       - CategoryGroup
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - groupname
 *               - createdby
 *             properties:
 *               groupname:
 *                 type: string
 *                 example: Office Supplies
 *               createdby:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image shown on the website for this group
 *     responses:
 *       200:
 *         description: Product group added successfully
 *       400:
 *         description: Missing or incorrect details
 *       500:
 *         description: Something went wrong
 */
router.post(
  '/',
  uploadCategoryGroupImage,
  controller.createCategoryGroup
);

/**
 * @swagger
 * /api/categorygroup:
 *   get:
 *     summary: View all product groups
 *     description: |
 *       This API returns all available product groups
 *       that are currently shown in the store.
 *     tags:
 *       - CategoryGroup
 *     responses:
 *       200:
 *         description: Product group list loaded successfully
 *       500:
 *         description: Something went wrong
 */
router.get('/', controller.getAllCategoryGroups);

/**
 * @swagger
 * /api/categorygroup/{id}:
 *   get:
 *     summary: View product group details
 *     description: |
 *       This API shows detailed information about
 *       a specific product group.
 *     tags:
 *       - CategoryGroup
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product group ID
 *     responses:
 *       200:
 *         description: Product group details displayed
 *       404:
 *         description: Product group not found
 *       500:
 *         description: Something went wrong
 */
router.get('/:id', controller.getCategoryGroupById);

/**
 * @swagger
 * /api/categorygroup/{id}:
 *   put:
 *     summary: Update product group
 *     description: |
 *       This API allows the admin to update
 *       the name or image of a product group.
 *       Changes will be reflected on the website.
 *     tags:
 *       - CategoryGroup
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product group ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               groupname:
 *                 type: string
 *                 example: Writing Instruments
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image for the product group
 *     responses:
 *       200:
 *         description: Product group updated successfully
 *       404:
 *         description: Product group not found
 *       500:
 *         description: Something went wrong
 */
router.put(
  '/:id',
  uploadCategoryGroupImage,
  controller.updateCategoryGroup
);

/**
 * @swagger
 * /api/categorygroup/{id}:
 *   delete:
 *     summary: Remove product group
 *     description: |
 *       This API removes a product group from the store.
 *       The group will no longer be visible to customers,
 *       but its details will be kept for records.
 *     tags:
 *       - CategoryGroup
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deletedBy
 *             properties:
 *               deletedBy:
 *                 type: integer
 *                 example: 1
 *                 description: Admin who removed the product group
 *     responses:
 *       200:
 *         description: Product group removed successfully
 *       400:
 *         description: Admin details missing
 *       404:
 *         description: Product group not found
 *       500:
 *         description: Something went wrong
 */
router.delete('/:id', controller.deleteCategoryGroup);
module.exports = router;
