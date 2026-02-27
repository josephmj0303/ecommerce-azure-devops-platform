const repo = require('./shipping.repository');

/**
 * Shipping Address Service
 *
 * - Handles business logic for shipping addresses
 * - Delegates all DB operations to repository
 */

exports.createAddress = (data) => repo.createAddress(data);
exports.getAddressByUser = (userid) => repo.getAddressByUser(userid);
exports.updateAddress = (id, data) => repo.updateAddress(id, data);
exports.deleteAddress = (id) => repo.deleteAddress(id);
