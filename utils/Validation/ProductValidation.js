const { check, body } = require("express-validator");
const slugify = require("slugify");
const middlewareValidator = require("../../Middleware/MiddlewareValidator");
const categoryModel = require("../../Model/categoryModel");
const subCategoryModel = require("../../Model/subCategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Product nmae too short")
    .isLength({ max: 100 })
    .withMessage("Product name too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 20 })
    .withMessage("Description is too short"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity cannot be empty")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Price cannot be empty")
    .toFloat()
    .isNumeric()
    .withMessage("Price must be a number")
    .isLength({ max: 10000 })
    .withMessage("Price of product is too expensive"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((discount, { req }) => {
      if (req.body.price <= discount)
        throw new Error("Price After Discount must be lower than old price");
      return true;
    }),
  check("availableColors")
    .optional()
    .isArray()
    .withMessage("Product must contain more than one color"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product must contain more than one image"),
  check("imageCover")
    .notEmpty()
    .withMessage("Image Cover for product is required"),
  check("sold").optional().isNumeric().withMessage("Sold Must be a number"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to category")
    .isMongoId()
    .withMessage("Invalid category id")
    .custom((id) =>
      categoryModel.findById(id).then((category) => {
        if (!category)
          return Promise.reject(new Error("This category id not exist"));
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id")
    .custom((val) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: val } })
        .then((result) => {
          if (result.length < 1 || result.length !== val.length) {
            return Promise.reject(new Error("SubCategory id cannot be found"));
          }
        })
    )
    .custom((val, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })
        .then((subCategories) => {
          // eslint-disable-next-line prefer-const
          let subCategoriesIdInDb = [];
          subCategories.forEach((subCategory) =>
            subCategoriesIdInDb.push(subCategory._id.toString())
          );
          const checkValues = val.every((v) => subCategoriesIdInDb.includes(v));
          if (!checkValues)
            return Promise.reject(
              new Error("Some of subCategories not belong to this category")
            );
        })
    ),
  check("brand").optional().isMongoId().withMessage("Invalid category id"),
  middlewareValidator,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  body("title").custom((val, { req }) => {
    if (val) req.body.slug = slugify(val);
    return true;
  }),
  middlewareValidator,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  middlewareValidator,
];
