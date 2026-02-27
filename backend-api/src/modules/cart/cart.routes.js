const express = require('express');
const router = express.Router();
const cartService = require('./cart.service');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart APIs
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - productid
 *               - qty
 *               - createdby
 *             properties:
 *               userid:
 *                 type: integer
 *                 example: 1
 *               productid:
 *                 type: integer
 *                 example: 101
 *               qty:
 *                 type: integer
 *                 example: 2
 *               createdby:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 */
router.post('/', async (req, res) => {
  try {
    const result = await cartService.addToCart(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/cart/{userid}:
 *   get:
 *     summary: Get cart by user id
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User cart fetched
 */
router.get('/:userid', async (req, res) => {
  try {
    const data = await cartService.getCartByUserId(req.params.userid);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// /**
//  * @swagger
//  * /api/cart/{cartid}:
//  *   put:
//  *     summary: Update cart quantity
//  *     tags: [Cart]
//  *     parameters:
//  *       - in: path
//  *         name: cartid
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - qty
//  *               - modifiedby
//  *             properties:
//  *               qty:
//  *                 type: integer
//  *                 example: 5
//  *               modifiedby:
//  *                 type: integer
//  *                 example: 1
//  *     responses:
//  *       200:
//  *         description: Cart quantity updated
//  */
// router.put('/:cartid', async (req, res) => {
//   try {
//     const { qty, modifiedby } = req.body;
//     const result = await cartService.updateCartQty(
//       req.params.cartid,
//       qty,
//       modifiedby
//     );
//     res.json({ success: true, data: result });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update cart quantities
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modifiedby
 *               - items
 *             properties:
 *               modifiedby:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - cartid
 *                     - qty
 *                   properties:
 *                     cartid:
 *                       type: integer
 *                       example: 12
 *                     qty:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       200:
 *         description: Cart quantities updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/', async (req, res) => {
  try {
    const { items, modifiedby } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No cart items provided'
      });
    }

    await cartService.updateCartBulk(items, modifiedby);

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });

  } catch (err) {
    console.error(err + JSON.stringify(items));
    res.status(500).json({
      success: false,
      message: JSON.stringify(items)
    });
  }
});



/**
 * @swagger
 * /api/cart/{cartid}:
 *   delete:
 *     summary: Delete cart item (soft delete)
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartid
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
 *         description: Cart item deleted
 */
router.delete('/:cartid', async (req, res) => {
  try {
    await cartService.deleteCartItem(
      req.params.cartid,
      req.body.deletedby
    );
    res.json({ success: true, message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
