const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Name too short"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email required"],
      lowercase: true,
    },
    profileImg: String,
    phone: String,
    password: {
      type: String,
      required: true,
      min: [8, "Password is too short"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    favorites: [String],
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordVerified: Boolean,
    passwordExpires: Number,

    wishlist: [
      {
        type: Schema.ObjectId,
        ref: "product",
      },
    ],

    addresses: [
      {
        id: Schema.Types.ObjectId,
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },

  { timestamps: true }
);

UserModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserModel.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

module.exports = model("user", UserModel);
