const service = require('./categoryGroup.service');
const ApiResponse = require('../../utils/apiResponse');

exports.createCategoryGroup = async (req, res, next) => {
  try {
    const data = await service.createCategoryGroup(req.body);
    res.json(
      ApiResponse.success(data, 'Category group created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

exports.getAllCategoryGroups = async (req, res, next) => {
  try {
    const data = await service.getAllCategoryGroups();
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

exports.getCategoryGroupById = async (req, res, next) => {
  try {
    const data = await service.getCategoryGroupById(req.params.id);
    res.json(
      ApiResponse.success(data, 'Category group details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

exports.updateCategoryGroup = async (req, res, next) => {
  try {
    const data = await service.updateCategoryGroup(
      req.params.id,
      req.body
    );
    res.json(
      ApiResponse.success(data, 'Category group updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteCategoryGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;

    // ✅ Validation
    if (!deletedBy) {
      return res.status(400).json(
        ApiResponse.error('deletedBy is required')
      );
    }

    await service.deleteCategoryGroup(id, deletedBy);

    res.json(
      ApiResponse.success(null, 'Category group removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};
