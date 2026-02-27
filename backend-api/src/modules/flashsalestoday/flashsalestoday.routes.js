/**
 * Flash Sales Routes
 *
 * - Provides Flash Sales products for today
 * - If orders exist today → returns ordered products
 * - If no orders today → returns top 5 products per category
 * - Swagger enabled
 */

const router = require('express').Router();
const controller = require('./flashsalestoday.controller');

/**
 * @swagger
 * /api/flashsalestoday:
 *   get:
 *     summary: Get Flash Sales Today
 *     description: >
 *       Returns today's flash sale products.
 *       If orders exist today, ordered products are returned.
 *       Otherwise, top 5 active products per category are returned.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Flash sale product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Flash Sales Today fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productid:
 *                         type: integer
 *                       productname:
 *                         type: string
 *                       productcode:
 *                         type: string
 *                       productimage:
 *                         type: string
 *                       groupid:
 *                         type: integer
 *                       groupname:
 *                         type: string
 *                       categoryid:
 *                         type: integer
 *                       categoryname:
 *                         type: string
 *                       mrp:
 *                         type: number
 *                       wholesaleprice:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get('/', controller.getFlashSalesToday);
module.exports = router;
