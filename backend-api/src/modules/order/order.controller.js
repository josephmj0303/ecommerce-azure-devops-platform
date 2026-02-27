const service = require('./order.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * CREATE ORDER (Order + Items + Status)
 */
exports.createorder = async (req, res, next) => {
  try {
    const data = await service.createorder(req.body);
    res.json(
      ApiResponse.success(data, 'Order created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET ALL ORDERS (ADMIN)
 */
exports.getAllorders = async (req, res, next) => {
  try {
    const data = await service.getAllorders();
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

/**
 * GET ORDER BY ID
 */
exports.getorder = async (req, res, next) => {
  try {
    const data = await service.getorderById(req.params.id);
    res.json(
      ApiResponse.success(data, 'Order details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET ORDER BY ORDER NO
 */
exports.getorderinvoice = async (req, res, next) => {
  try {
    logger.info(`Fetching order details for order number: ${req.params.orderno}`);
    const data = await service.getOrderByInvoiceNo(req.params.orderno);
    res.json(
      ApiResponse.success(data, 'Order details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET ORDERS BY USER ID
 */
exports.getOrdersByUser = async (req, res, next) => {
  try {
    const data = await service.getOrdersByUserId(req.params.userid);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE ORDER STATUS
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, remarks, modifiedby } = req.body;

    const data = await service.updateOrderStatus(
      req.params.id,
      status,
      remarks,
      modifiedby
    );

    res.json(
      ApiResponse.success(data, 'Order status updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE ORDER (SOFT DELETE)
 */
exports.deleteorder = async (req, res, next) => {
  try {
    await service.deleteOrder(
      req.params.id,
      req.body.deletedby
    );

    res.json(
      ApiResponse.success(null, 'Order removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET ORDER STATUS HISTORY
 */
exports.getOrderStatusHistory = async (req, res, next) => {
  try {
    const data = await service.getOrderStatusHistory(
      req.params.id
    );

    res.json(
      ApiResponse.success(
        data,
        'Order status history retrieved successfully.'
      )
    );
  } catch (err) {
    next(err);
  }
};
