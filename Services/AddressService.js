const asyncHandler = require("express-async-handler");
const User = require("../Model/userModel");

// @desc Add new address to user address user list
// @route POST /api/v2/addresses
// @access protected /user
exports.addAddress = asyncHandler(async (req, res) => {
  // $addToSet => added address in array of object to user model if address not exist
  const user = await User.findOneAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "Success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc Remove address from user list
// @route DELETE /api/v2/addresses/:adressId
// @access protected /user
exports.removeAddress = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// @desc get all address for user from list
// @route GET /api/v2/addresses
// @access protected /user
exports.getLoggedUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "Success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
