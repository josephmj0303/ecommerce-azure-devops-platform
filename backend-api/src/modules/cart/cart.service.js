// services/cart.service.js
const cartRepo = require('./cart.repository');

exports.addToCart = async (payload) => {
  return await cartRepo.addToCart(payload);
};

exports.getCartByUserId = async (userid) => {
  return await cartRepo.getCartByUserId(userid);
};

exports.updateCartQty = async (cartid, qty, modifiedby) => {
  return await cartRepo.updateCartQty(cartid, qty, modifiedby);
};

exports.updateCartBulk = async (items, modifiedby) => {
  return await cartRepo.updateCartBulk(items, modifiedby);
};

exports.deleteCartItem = async (cartid, deletedby) => {
  return await cartRepo.deleteCartItem(cartid, deletedby);
};
