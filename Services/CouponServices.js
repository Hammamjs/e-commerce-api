const factory = require("./HandlerFactory");
const Coupon = require("../Model/couponModel");

// @desc POST Coupon
// @route api/v2/coupons
// @access Private (admin, manger)
exports.createCoupon = factory.createOne(Coupon);

// @desc Get Coupons
// @route api/v2/coupons
// @access Private (admin, manger)
exports.getCoupons = factory.getAll(Coupon);

// @desc Get Coupon By Id
// @route api/v2/coupons/:id
// @access Private (admin, manger)
exports.getCoupon = factory.getOne(Coupon);

// @desc UPDATE Coupon
// @route api/v2/coupons/:id
// @access Private (admin, manger)
exports.updateCoupon = factory.updateOne(Coupon);

// @desc DELETE Coupon
// @route api/v2/coupons/:id
// @access Private (admin, manger)
exports.deleteCoupon = factory.deleteOne(Coupon);
