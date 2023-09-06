const { Schema, model } = require("mongoose");

const subCategory = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory Must be unique"],
      minlength: [3, "SubCategory name too short"],
      maxlength: [32, "SubCategory name too long"],
      required: [true, "SubCategory Cannot be empty"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.ObjectId,
      required: [true, "SubCategory must belong to category"],
      ref: "category",
    },
  },
  { timestamps: true }
);

subCategory.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

module.exports = model("subCategory", subCategory);
