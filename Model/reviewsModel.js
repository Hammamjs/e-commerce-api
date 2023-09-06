const { Schema, model } = require("mongoose");
const Product = require("./productModel");

const reviewsModel = new Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      required: [true, "Review rating required "],
      min: [1, "Review must be 1 at least"],
      max: [5, "Review must be 5 as a maximum"],
    },
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: [true, "Review must belong to user"],
    },
    product: {
      type: Schema.ObjectId,
      ref: "product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewsModel.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewsModel.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result)
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].avgQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewsModel.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewsModel.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = model("reviews", reviewsModel);
