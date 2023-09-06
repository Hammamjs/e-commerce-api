const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const BrandModel = require("../Model/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./HandlerFactory");

// upload brand Image

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${Date.now()}-${Math.floor(
    Math.random() * 100000
  )}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brand/${fileName}`);
    req.body.image = fileName;
  }
  next();
});

// @desc Get Request
// @route /api/v2/Brands
//@access Public
exports.getBrands = getAll(BrandModel);

// #desc POST Request
// @route /api/v2/brands
// @access Private
exports.createBrand = createOne(BrandModel);

// @desc GET specific Brand
// @route /api/v2/brand/:id
// @access Public
exports.getBrand = getOne(BrandModel);

exports.updateBrand = updateOne(BrandModel);

exports.deleteBrand = deleteOne(BrandModel);
