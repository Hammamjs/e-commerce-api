const { Schema, default: mongoose } = require("mongoose");

const categoryModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name Cannot be empty"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Name is too short"],
      trim: true,
      maxlength: [32, "Name is too long"],
    },
    slug: { type: String, lowercase: true },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categoryModel);
