const express = require('express');
const userAuthRoutes = require('./userAuth.routes');
const categoriesRoutes = require('./category.routes');
const productsRoutes = require('./product.routes');
const router = express.Router();

router.use('/auth', userAuthRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);

module.exports = router;    