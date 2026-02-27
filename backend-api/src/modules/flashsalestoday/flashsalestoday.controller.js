const service = require('./flashsalestoday.service');


/**
 * Get Flash Product Sales Today
 */
exports.getFlashSalesToday = async (req, res, next) => {
  try {
    const data = await service.getFlashSaleProducts();
    res.json({ success: true, message: 'Product Collected Successfully', data });
  } catch (err) {
    next(err);
  }
};
