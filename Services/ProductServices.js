const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadImages } = require("../Middleware/UploadImageMiddleware");
const ProductModel = require("../Model/productModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./HandlerFactory");

exports.uploadProductImages = uploadImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${Date.now()}-${Math.floor(
      Math.random() * 100000
    )}.jpeg`;
    if (req.files.imageCover[0].buffer) {
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/product/${imageCoverFileName}`);
      req.body.imageCover = imageCoverFileName;
    }
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const ImgFileName = `product-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/product/${ImgFileName}`);
        req.body.images.push(ImgFileName);
      })
    );
    next();
  }
});

// @desc Get Request
// @route /api/v2/products
//@access Public
exports.getProducts = getAll(ProductModel, "product");

// #desc POST Request
// @route /api/v2/products
// @access Private
exports.createProduct = createOne(ProductModel);

// @desc GET specific Product
// @route /api/v2/products/:id
// @access Public

exports.getProduct = getOne(ProductModel);

exports.updateProduct = updateOne(ProductModel);

exports.deleteProduct = deleteOne(ProductModel);
