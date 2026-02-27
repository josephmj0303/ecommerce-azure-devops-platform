/**
 * Product Routes
 *
 * - Defines endpoints related to products
 * - Supports CRUD operations
 * - Includes Swagger documentation for API reference
 */

const router = require('express').Router();
const controller = require('./product.controller');
const { uploadProductImages } = require('../../middlewares/upload.middleware');

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create product
 *     description: Create a new product with multiple images
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productcode:
 *                 type: string
 *                 example: BK001
 *               productname:
 *                 type: string
 *                 example: Notebook
 *               shortdescription:
 *                 type: string
 *                 example: 200 pages notebook
 *               categoryid:
 *                 type: integer
 *                 example: 1
 *               subcategoryid:
 *                 type: integer
 *                 example: 2
 *               deptid:
 *                 type: integer
 *                 example: 1
 *               storeid:
 *                 type: integer
 *                 example: 1
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product created successfully
 */
router.post('/', uploadProductImages, controller.createProduct);

/**
 * @swagger
 * /api/product/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     description: Returns all active products under a category
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Product list
 */
router.get('/category/:categoryId', controller.getProductByCategoryId);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Get product details
 *     description: Returns product details with product images
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:productId', controller.getProductById);

/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *     summary: Update product
 *     description: Update product details along with images
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productcode
 *               - productname
 *               - categoryid
 *               - subcategoryid
 *               - deptid
 *               - storeid
 *             properties:
 *               productcode:
 *                 type: string
 *                 example: PRD001
 *               productname:
 *                 type: string
 *                 example: Apple iPhone 15
 *               shortdescription:
 *                 type: string
 *                 example: 128GB Black
 *               categoryid:
 *                 type: integer
 *                 example: 1
 *               subcategoryid:
 *                 type: integer
 *                 example: 3
 *               deptid:
 *                 type: integer
 *                 example: 2
 *               storeid:
 *                 type: integer
 *                 example: 1
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - /uploads/products/iphone1.jpg
 *                   - /uploads/products/iphone2.jpg
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:productId', controller.updateProduct);


/**
 * @swagger
 * /api/product/{productId}:
 *   delete:
 *     summary: Delete product
 *     description: Soft delete a product
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/:productId', controller.deleteProduct);

module.exports = router;
