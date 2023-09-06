const sharp = require("sharp");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const User = require("../Model/userModel");

const {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} = require("./HandlerFactory");
const ApiError = require("../utils/ApiError");

// upload user image

exports.uploadUserImg = uploadSingleImage("profileImg");

exports.resizeUserImg = asyncHandler(async (req, res, next) => {
  const profileImgName = `user-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${profileImgName}`);
    req.body.profileImg = profileImgName;
  }

  next();
});

// @desc POST to Create user
// @route /api/v2/users
// @acces public
exports.createUser = createOne(User);

// @desc GET All users
// @route /api/v2/users
// @acces private
exports.getAllUsers = getAll(User);

// @desc GET to specific user by id
// @route /api/v2/users/:id
// @acces private
exports.getUser = getOne(User);

// @desc PUT to update user
// @route /api/v2/users/:id
// @acces private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError("This user not found", 404));
  }

  res.status(200).json({ data: user });
});

// update User Pssword Route

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password: await bcrypt.hash(req.body.password, 12) },
    { new: true }
  );
  if (!user) return next(new ApiError("This user not exsist", 404));
  res.status(200).json({ msg: "Password updated" });
});

// @desc DELETE  user
// @route /api/v2/users/:id
// @acces private
exports.deleteUser = deleteOne(User);
