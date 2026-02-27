const repo = require('./flashsalestoday.repository');

/**
 * Shipping Address Service
 *
 * - Handles business logic for shipping addresses
 * - Delegates all DB operations to repository
 */
exports.getFlashSaleProducts = async () =>
  await repo.getFlashSaleProducts();