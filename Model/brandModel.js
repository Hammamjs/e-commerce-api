const { Schema, default: mongoose } = require("mongoose");

const brandModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name Cannot be empty"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Name is too short"],
      trim: true,
      maxlength: [32, "Name is too long"],
    },
    slug: { type: String, lowercase: true },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imgUrl;
  }
};
// findOne  , findAll Update
brandModel.post("init", (doc) => {
  setImageUrl(doc);
});

// create
brandModel.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("brand", brandModel);
