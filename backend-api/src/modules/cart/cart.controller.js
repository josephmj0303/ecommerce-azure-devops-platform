const service = require('./cart.service');
const ApiResponse = require('../../utils/apiResponse');

exports.addToCart = async (req, res, next) => {
  try {
    const data = await service.addToCart(req.body);
    res.json(
      ApiResponse.success(data, 'Item added to cart')
    );
  } catch (err) {
    next(err);
  }
};

exports.getCartByUserId = async (req, res, next) => {
  try {
    const data = await service.getCartByUserId(req.params.userid);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

exports.updateCartQty = async (req, res, next) => {
  try {
    const data = await service.updateCartQty(
      req.params.cartid,
      req.body.qty,
      req.body.modifiedby
    );
    res.json(
      ApiResponse.success(data, 'Cart updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

exports.updateCartBulk = async (req, res, next) => {
  try {
    const { items, modifiedby } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.json(
        ApiResponse.error('No cart items provided', 400)
      );
    }

    await service.updateCartBulk(items, modifiedby);

    res.json(
      ApiResponse.success(null, 'Cart updated successfully')
    );
  } catch (err) {
    next(err);
  }
};


exports.deleteCartItem = async (req, res, next) => {
  try {
    await service.deleteCartItem(
      req.params.cartid,
      req.body.deletedby
    );
    res.json(
      ApiResponse.success(null, 'Item removed from cart')
    );
  } catch (err) {
    next(err);
  }
};
