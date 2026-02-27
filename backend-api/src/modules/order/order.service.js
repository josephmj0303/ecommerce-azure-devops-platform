const repo = require('./order.repository');

/**
 * PLACE ORDER (ORDER + ITEMS + STATUS)
 */
exports.createorder = async (data) => {
  return await repo.createorder(data);
};

/**
 * GET ALL ORDERS (ADMIN)
 */
exports.getAllorders = async () => {
  return await repo.getAllOrders();
};

/**
 * GET ORDERS BY USER ID
 */
exports.getOrdersByUserId = async (userid) => {
  return await repo.getOrdersByUserId(userid);
};

/**
 * GET ORDER DETAILS BY ORDER ID
 */
exports.getorderById = async (orderid) => {
  return await repo.getOrderById(orderid);
};

/**
 * GET ORDER DETAILS BY ORDER NO
 */
exports.getOrderByInvoiceNo = async (orderno) => {
  return await repo.getOrderByInvoiceNo(orderno);
};

/**
 * GET ORDER STATUS HISTORY
 */
exports.getOrderStatusHistory = async (orderid) => {
  return await repo.getOrderStatusHistory(orderid);
};

/**
 * UPDATE ORDER STATUS
 */
exports.updateOrderStatus = async (orderid, data) => {
  const { status, remarks, modifiedby } = data;

  // update main order table
  const order = await repo.updateOrderStatus(
    orderid,
    status,
    remarks,
    modifiedby
  );

  return order;
};

/**
 * DELETE ORDER (SOFT DELETE)
 */
exports.deleteorder = async (orderid, deletedby) => {
  return await repo.deleteOrder(orderid, deletedby);
};
