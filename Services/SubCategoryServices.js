const SubCategory = require("../Model/subCategoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./HandlerFactory");

exports.getSubCategories = getAll(SubCategory);

exports.addIdToBody = (req, res, next) => {
  // To insert params to body if its not passed
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.setProductIdToBody = (req, res, next) => {
  // to get subCategory for specific category
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.createSubCategories = createOne(SubCategory);

exports.getSubCategory = getOne(SubCategory);

exports.updateSubCategory = updateOne(SubCategory);

exports.deleteSubCategory = deleteOne(SubCategory);
