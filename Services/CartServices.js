const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Cart = require("../Model/cartModel");
const Product = require("../Model/productModel");
const Coupon = require("../Model/couponModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc add product to cart
// @route api/v2/cart
// @access protected  user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    message: "Product added to cart",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc get all product in cart fro loggesd user
// @route api/v2/cart
// @access protected  user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("No items in cart", 404));
  res.status(200).json({
    status: "Success",
    numOfItems: cart.cartItems.length,
    cart,
  });
});

// @desc remove specific product from cart
// @route api/v2/cart/:id
// @access protected  user
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    numOfItems: cart.cartItems.length,
    cart,
  });
});

// @desc clear cart loggeduser
// @route api/v2/cart
// @access protected  user
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc UPDATE quanity for specific product in cart
// @route api/v2/cart/:itemId
// @access protected  user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("There is no items in cart", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems = cartItem;
  } else {
    return next(new ApiError("There is no item for this id", 404));
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
// @desc PUT Apply coupon
// @route api/v2/cart/apply-coupon
// @access protected  user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) return next(new ApiError("Coupon invalid or expired"));

  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res
    .status(200)
    .json({ status: "Success", numOfCartItems: cart.cartItems.length, cart });
});
