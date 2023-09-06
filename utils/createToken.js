const jwt = require("jsonwebtoken");

exports.createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

exports.sendCookieToBrowser = (res, token) => {
  const expiresDate = new Date();
  const cookieOptions = {
    maxAge: expiresDate.setDate(expiresDate.getDate() + 90),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
};
