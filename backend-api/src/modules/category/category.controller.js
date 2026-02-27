const service = require('./category.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Category Controller
 *
 * - Handles HTTP requests
 * - Returns user-friendly responses
 */

/**
 * Create Category
 */
exports.createCategory = async (req, res, next) => {
  try {
    const data = await service.createCategory(req.body);
    res.json(
      ApiResponse.success(data, 'Category has been created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Get Categories By GroupId
 */
exports.getCategoriesByGroupId = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const data = await service.getCategoriesByGroupId(groupId);
    res.json(
      ApiResponse.success(data, 'Categories retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Get Category By CategoryId
 *
 * - Reads categoryId from request params
 * - Returns category details
 */
exports.getCategoriesByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const data = await service.getCategoriesByCategoryId(categoryId);

    res.json(
      ApiResponse.success(data, 'Category details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};


/**
 * Update Category
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const data = await service.updateCategory(req.params.id, req.body);
    res.json(
      ApiResponse.success(data, 'Category updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Category
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    await service.deleteCategory(req.params.id);
    res.json(
      ApiResponse.success(null, 'Category removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};
