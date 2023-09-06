const factory = require("./HandlerFactory");
const Review = require("../Model/reviewsModel");

// nested Route
// @route api/v2/product/:productId/reviews
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc Get Reviews
// @route api/v2/reviews
// @access protect/user/admin
exports.getReviews = factory.getAll(Review);

// @desc Get Review
// @route api/v2/reviews/:id
// @access protect/user/admin
exports.getReview = factory.getOne(Review);

// nested route

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

// @desc POST create Review
// @route api/v2/reviews
// @access protect/user
exports.createReivew = factory.createOne(Review);

// @desc put Review
// @route api/v2/:id
// @access protect/user
exports.updateReview = factory.updateOne(Review);

// @desc Delete Review
// @route api/v2/reviews/:id
// @access protect/user/admin
exports.deleteReview = factory.deleteOne(Review);
