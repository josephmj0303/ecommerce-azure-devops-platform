const repo = require('./category.repository');

/**
 * Category Service
 *
 * - Handles business logic for category
 */
exports.createCategory = (data) => repo.createCategory(data);
exports.getCategoriesByGroupId = (groupId) => repo.getCategoriesByGroupId(groupId);
exports.getCategoriesByCategoryId = (categoryId) => repo.getCategoriesByCategoryId(categoryId);
exports.updateCategory = (id, data) => repo.updateCategory(id, data);
exports.deleteCategory = (id) => repo.deleteCategory(id);