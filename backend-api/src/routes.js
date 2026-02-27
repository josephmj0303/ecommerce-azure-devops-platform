/**
 * Main Router
 *
 * - Aggregates all module routes
 * - Prefixes endpoints for each module
 */

const express = require('express');
const CategoryGroup = require('./modules/categorygroup/categoryGroup.routes');
const Category = require('./modules/category/category.routes');
const Product = require('./modules/product/product.routes');
const User = require('./modules/user/user.routes');
const Shipping = require('./modules/shipping/shipping.routes');
const Cart = require('./modules/cart/cart.routes');
const FlashSalesToday =  require('./modules/flashsalestoday/flashsalestoday.routes');
const Order = require('./modules/order/order.routes');

const router = express.Router();
router.use('/CategoryGroup', CategoryGroup);
router.use('/Category', Category);
router.use('/Product', Product);
router.use('/User', User);
router.use('/Shipping', Shipping);
router.use('/Cart', Cart);
router.use('/FlashSalesToday', FlashSalesToday);
router.use('/Order', Order);
module.exports = router;
