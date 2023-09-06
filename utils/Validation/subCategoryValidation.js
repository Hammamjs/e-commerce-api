const { check } = require("express-validator");
const slugify = require("slugify");
const CategoryModel = require("../../Model/categoryModel");
const middlewareValidator = require("../../Middleware/MiddlewareValidator");

exports.createSubCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("SubCategory name is too short")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to specific Category")
    .isMongoId()
    .withMessage("Invalid Category Id ")
    .custom((id, { req }) =>
      CategoryModel.findById(id).then((category) => {
        if (!category)
          return Promise.reject(new Error(`This category id not exist ${id}`));
      })
    ),
  middlewareValidator,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  middlewareValidator,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      if (val) req.body.slug = slugify(val);
      return true;
    }),
  middlewareValidator,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  middlewareValidator,
];
