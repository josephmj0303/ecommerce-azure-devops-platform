const e = require('express');
const repo = require('./product.repository');

exports.createProduct = async (data, images) => {
  const product = await repo.createProduct(data);
  if (images.length) {
    await repo.insertProductImages(product.productid, images);
  }
  return product;
};

exports.getProductByCategoryId = async (categoryId) =>
   await repo.getProductByCategoryId(categoryId);

exports.getProductById = async (productId) =>
  await repo.getProductById(productId);

exports.updateProduct = async (id, data) =>
  await repo.updateProduct(id, data);

exports.deleteProduct = async (id) =>
  await repo.deleteProduct(id);