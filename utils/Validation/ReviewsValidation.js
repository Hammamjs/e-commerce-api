const { check } = require("express-validator");
const middlewareValidator = require("../../Middleware/MiddlewareValidator");
const Product = require("../../Model/productModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];

exports.createReviewValidator = [
  check("title").notEmpty().withMessage("Review name cannot be empty"),
  check("product")
    .notEmpty()
    .withMessage("Review must belong to product")
    .isMongoId()
    .withMessage("Invalid id")
    .custom((val, { req }) => {
      Product.findById(val).then((productId) => {
        if (!productId) return Promise.reject(new Error("This Id Not found"));
      });
      return true;
    }),
  middlewareValidator,
];

exports.updateReviewValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  check("title").optional(),
  middlewareValidator,
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];
