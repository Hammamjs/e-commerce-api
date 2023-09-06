const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const CategoryModel = require("../Model/categoryModel");
const { uploadSingleImage } = require("../Middleware/UploadImageMiddleware");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./HandlerFactory");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/category/${fileName}`);

    req.body.image = fileName;
  }
  next();
});

// @desc Get Request
// @route /api/v2/categories
//@access Public
exports.getCategories = getAll(CategoryModel);

// #desc POST Request
// @route /api/v2/categories
// @access Private
exports.createCategory = createOne(CategoryModel);

// @desc GET specific category
// @route /api/v2/categories/:id
// @access Public

exports.getCategory = getOne(CategoryModel);

exports.updateCategory = updateOne(CategoryModel);

exports.deleteCategory = deleteOne(CategoryModel);
