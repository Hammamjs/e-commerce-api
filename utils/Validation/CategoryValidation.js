const { check } = require("express-validator");
const slugify = require("slugify");
const middlewareValidator = require("../../Middleware/MiddlewareValidator");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Category nmae too short")
    .isLength({ max: 32 })
    .withMessage("Category name too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  middlewareValidator,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      if (val) req.body.slug = slugify(val);
      return true;
    }),
  middlewareValidator,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];
