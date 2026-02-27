const service = require('./shipping.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Shipping Address Controller
 *
 * - Handles HTTP requests for shipping addresses
 * - Returns user-friendly API messages
 */

/**
 * Create Address
 *
 * @route POST /api/address
 */
exports.createAddress = async (req, res, next) => {
  try {
    const data = await service.createAddress(req.body);
    res.json(ApiResponse.success(data, 'Your shipping address has been added successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Get Addresses By User
 *
 * @route GET /api/address/:userid
 */
exports.getAddressByUser = async (req, res, next) => {
  try {
    const data = await service.getAddressByUser(req.params.userid);
    res.json(ApiResponse.success(data, 'Your shipping addresses have been retrieved successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Update Address
 *
 * @route PUT /api/address/:id
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const data = await service.updateAddress(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Your shipping address has been updated successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Address
 *
 * @route DELETE /api/address/:id
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    await service.deleteAddress(req.params.id);
    res.json(ApiResponse.success(null, 'Your shipping address has been removed successfully.'));
  } catch (err) {
    next(err);
  }
};
