const service = require('./product.service');

/**
 * Create Product with Images
 */
exports.createProduct = async (req, res, next) => {
  try {
    const images = req.files
      ? req.files.map(f => `uploads/product/${f.filename}`)
      : [];

    const data = await service.createProduct(req.body, images);

    res.json({
      success: true,
      message: 'Product created successfully',
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Products by Category
 */
exports.getProductByCategoryId = async (req, res, next) => {
  try {
    const data = await service.getProductByCategoryId(req.params.categoryId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Product Details by ID
 */
exports.getProductById = async (req, res, next) => {
  try {
    const data = await service.getProductById(req.params.productId);
    res.json({ success: true, message: 'Product Collected Successfully', data });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Product
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const data = await service.updateProduct(req.params.id, req.body);
    res.json({ success: true, message: 'Product updated', data });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Product
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    await service.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
