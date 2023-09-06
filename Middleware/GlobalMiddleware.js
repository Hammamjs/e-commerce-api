const ApiError = require("../utils/ApiError");

const errorInDevMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errorInProdMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const TokenExpiredError = () =>
  new ApiError("Your session has expired please login again ...", 401);

const InvalidTokenSignature = () =>
  new ApiError("invalid Token signature, please login again", 401);

const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    errorInDevMode(err, res);
  } else {
    if (err.name === "TokenExpiredError") err = TokenExpiredError();
    if (err.name === "JsonWebTokenError") err = InvalidTokenSignature();
    // if (err.name === )
    errorInProdMode(err, res);
  }
};

module.exports = globalErrorMiddleware;
