const asyncHandler = require("express-async-handler");

const User = require("../Model/userModel");

// @desc Add product to user wishlist
// @route GET api/v2/wishlist
// @access protected / user
exports.addProductToUserWishlist = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product added successfull to wishlist",
    data: user.wishlist,
  });
});

// @desc remove product from user wishlist
// @route DELETE api/v2/wishlist/:productId
// @access protected / user
exports.removeProductFromUserWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product removed successfull from wishlist",
    data: user.wishlist,
  });
});

// @desc get user wishlist
// @route GET api/v2/wishlist
// @access protected / user
exports.getloggedUserWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "Success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
