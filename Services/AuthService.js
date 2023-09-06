const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Email = require("../utils/sendEmail");
const ApiError = require("../utils/ApiError");
const User = require("../Model/userModel");
const { createToken, sendCookieToBrowser } = require("../utils/createToken");

// @ desc Sign up
// @ access public
// @ route api/v2/auth/signup
exports.signup = asyncHandler(async (req, res) => {
  // create
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
    email: req.body.email,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // Generate JWT
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});
// @ desc login
// @ access public
// @ route api/v2/auth/login
exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const comparePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!user || !comparePassword)
    return Promise.reject(new ApiError("Email or Password incorrect", 401));

  // generate token
  const token = createToken(user._id);

  delete user.password;

  sendCookieToBrowser(res, token);

  res.status(200).json({ data: user, token });
});

// @ desc logout
// @ access public
// @ route api/v2/auth/logout
exports.logout = asyncHandler((req, res) => {
  res.cookie("jwt", "loggedout", {
    maxAge: 10 * 1000,
    httpOnly: true,
  });
  res.status(200).json({ status: "Success" });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new ApiError("Please login to get acces", 401));
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser)
    return next(
      new ApiError("This token that belong to this user no longer exist", 401)
    );

  // Check if user changed password

  if (currentUser.passwordChangedAt) {
    const changePasswordTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (changePasswordTimeStamp > decoded.iat) {
      // 100 > 200
      return next(
        new ApiError("User currently changed password please login again", 403)
      );
    }
  }

  req.user = currentUser;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("You Not have premission for this action", 403));
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new ApiError("Your email not found please try again", 404));

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;

  user.passwordExpires = Date.now() + 10 + 60 * 1000;
  user.passwordVerified = false;

  await user.save();

  const message = `Hi,${user.name}\n we received request for reset your password enter your code ${resetCode} thank you to help us to keep your account save`;
  try {
    await Email({
      email: user.email,
      subject: "Your reset code valid for (10 mins)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordExpires = undefined;
    user.passwordVerified = undefined;
    await user.save();
    return next(
      new ApiError("we got issue to send reset code for your email", 500)
    );
  }
  res.status(200).json({ status: "Reset code sent successfuly" });
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("This User reset code not found or expired", 400));
  }

  user.passwordVerified = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.ResetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }

  if (!user.passwordVerified)
    return next(new ApiError("Password not verified", 400));

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordExpires = undefined;
  user.passwordVerified = undefined;
  await user.save();
  const token = createToken(user._id);
  res.status(200).json({ token });
});
