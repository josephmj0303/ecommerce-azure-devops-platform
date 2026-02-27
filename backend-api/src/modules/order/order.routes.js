/**
 * Order Routes
 *
 * - Defines endpoints related to orders
 * - Supports order placement, listing, status update & soft delete
 * - Includes Swagger documentation
 */

const router = require('express').Router();
const controller = require('./order.controller');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - shippingaddressid
 *               - paymentstatus
 *               - createdby
 *               - items
 *             properties:
 *               userid:
 *                 type: integer
 *                 example: 1
 *               shippingaddressid:
 *                 type: integer
 *                 example: 3
 *               totalamount:
 *                 type: integer
 *                 example: 100.00
 *               paymentstatus:
 *                 type: string
 *                 example: PAID
 *               createdby:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productid
 *                     - productname
 *                     - productcode
 *                     - quantity
 *                     - unitprice
 *                   properties:
 *                     productid:
 *                       type: integer
 *                       example: 101
 *                     productname:
 *                       type: string
 *                       example: Notebook
 *                     productcode:
 *                       type: string
 *                       example: NB-001
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     unitprice:
 *                       type: number
 *                       example: 150
 *     responses:
 *       200:
 *         description: Order placed successfully
 */
router.post('/', controller.createorder);

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/', controller.getAllorders);

/**
 * @swagger
 * /api/order/user/{userid}:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User orders retrieved successfully
 */
router.get('/user/:userid', controller.getOrdersByUser);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get order details by order ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get('/:id', controller.getorder);

/**
 * @swagger
 * /api/order/no/{orderno}:
 *   get:
 *     summary: Get order details by order number
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderno
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get('/no/:orderno', controller.getorderinvoice);

/**
 * @swagger
 * /api/order/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - modifiedby
 *             properties:
 *               status:
 *                 type: string
 *                 example: SHIPPED
 *               remarks:
 *                 type: string
 *                 example: Order shipped via courier
 *               modifiedby:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.put('/:id/status', controller.updateOrderStatus);

/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Delete order (Soft delete)
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deletedby
 *             properties:
 *               deletedby:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Order deleted successfully
 */
router.delete('/:id', controller.deleteorder);
/**
 * @swagger
 * /api/order/{id}/status-history:
 *   get:
 *     summary: Get order status history
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order status history retrieved successfully
 */
router.get(
  '/:id/status-history',
  controller.getOrderStatusHistory
);


module.exports = router;
