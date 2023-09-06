const express = require("express");
const auth = require("../Services/AuthService");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../Services/CartServices");

const router = express.Router();

router.use(auth.protect, auth.allowedTo("user"));

router.route("/apply-coupon").put(applyCoupon);

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
