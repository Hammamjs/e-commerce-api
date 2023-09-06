const { check } = require("express-validator");
const slugify = require("slugify");
const middlewareValidator = require("../../Middleware/MiddlewareValidator");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Brand nmae too short")
    .isLength({ max: 32 })
    .withMessage("Brand name too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  middlewareValidator,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      if (val) req.body.slug = slugify(val);
      return true;
    }),
  middlewareValidator,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];
