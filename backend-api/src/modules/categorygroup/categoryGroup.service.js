const repo = require('./categoryGroup.repository');

exports.createCategoryGroup = async (data) =>
  await repo.createCategoryGroup(data);

exports.getAllCategoryGroups = async () =>
  await repo.getAllCategoryGroups();

exports.getCategoryGroupById = async (groupId) =>
  await repo.getCategoryGroupById(groupId);

exports.updateCategoryGroup = async (groupId, data) =>
  await repo.updateCategoryGroup(groupId, data);

exports.deleteCategoryGroup = async (groupId, deletedBy) =>
  await repo.deleteCategoryGroup(groupId, deletedBy);