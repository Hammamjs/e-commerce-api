const { model, Schema } = require("mongoose");

const orderModel = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: [true, "Order must belong to user"],
    },
    cartItems: [
      {
        product: {
          type: Schema.ObjectId,
          ref: "product",
        },
        color: String,
        quantity: Number,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },

    shoppingPrice: {
      type: Number,
      default: 0,
    },

    totalOrderPrice: {
      type: Number,
      default: 0,
    },

    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderModel.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({ path: "cartItems.product", select: "title imgCover" });
  next();
});

module.exports = model("Order", orderModel);
