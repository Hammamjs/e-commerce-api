const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const factory = require("./HandlerFactory");
const ApiError = require("../utils/ApiError");

const User = require("../Model/userModel");
const Product = require("../Model/productModel");
const Cart = require("../Model/cartModel");
const Order = require("../Model/orderModel");

// @desc Create Cash Order
// @route api/v2/orders/:cartId
// @access protected /user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new ApiError("This cart id not found"));
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalPrice = cartPrice + taxPrice + shippingPrice;
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.items,
    totalPrice,
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(req.param.cartId);
  }
  res.status(200).json({ status: "Success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc Get all orders
// @route POST api/v2/orders
// @access Private admin/user/manger
exports.getAllOrders = factory.getAll(Order);

// @desc Get specific order
// @route POST api/v2/orders/:id
// @access Private admin/user/manger
exports.findSpecificOrder = factory.getOne(Order);

// @desc update Paid order
// @route PUT api/v2/orders/:id/pay
// @access Private admin/user/manger
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ApiError("there is no order", 404));
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "Success", data: updateOrder });
});

// @desc update deliverd order
// @route PUT api/v2/orders/:id/deliver
// @access Private admin/user/manger
exports.updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ApiError("There is no order", 404));

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "Success", data: updateOrder });
});

// @desc create checkout
// @route POST api/v2/orders/checkout-session/:cartId
// @access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new ApiError("There is no cart for this id", 404));
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalPrice = taxPrice + shippingPrice + cartPrice;
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalPrice,
  });
  if (!order) return next(new ApiError("There is no order", 404));
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: req.body.name },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    success_url: `${req.protocol}://${req.get("host")}/order`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "Success", session });
});

const createCartOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amout_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });
  // create order with default PaymentMethodType
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "cash",
  });

  // After creating order, increment quantity sold and decrement product quantity

  if (order) {
    const bulkOption = await cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc this webhook will run when stripe payment success paid
// @route POST /webhook-checkout
// @access protected /user
exports.webhookCheckout = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createCartOrder(event.data.object);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ recived: true });
});
