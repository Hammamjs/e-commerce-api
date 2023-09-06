const { Schema, model } = require("mongoose");

const ProductModel = new Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title name too short"],
      maxlength: [100, "Title name too short"],
      required: [true, "Title is Required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minlength: [20, "Description is too short"],
      required: true,
    },
    price: {
      type: Number,
      max: [10000, "Price is too expensive"],
      required: [true, "Price cannot be empty"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    availableColors: [String],
    imageCover: {
      type: String,
      required: [true, "Image Cover is required"],
    },
    images: [String],
    quantity: {
      type: Number,
      required: [true, "Quantity is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      min: [1, "Average rating cannot be less than 1"],
      max: [5, "Average rating cannot be more than 5"],
    },
    RatingsAverage: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.ObjectId,
      required: [true, "Product must belong to Category"],
      ref: "category",
    },
    subcategories: [
      {
        type: Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: Schema.ObjectId,
      ref: "brand",
    },
  },
  { timestamps: true }
);

module.exports = model("product", ProductModel);
