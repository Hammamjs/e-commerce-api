const { check } = require("express-validator");
const User = require("../../Model/userModel");
const middlewareValidator = require("../../Middleware/MiddlewareValidator");

exports.signupValidator = [
  check("name").notEmpty().withMessage("Name is Required").isLength({ min: 3 }),

  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid Email format")
    .custom((val, { req }) =>
      User.findOne({ email: val }).then((email) => {
        if (email) {
          return Promise.reject(new Error("This email already used"));
        }
      })
    ),

  check("phone").optional(),

  check("password")
    .notEmpty()
    .withMessage("Password is requird")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 charcters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm)
        throw new Error("PasswordConfirm and password not match");
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("PasswordConfirm is required"),

  check("role").optional(),

  check("profileImg").optional(),

  middlewareValidator,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("This is invalid email"),
  middlewareValidator,
];

exports.getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid is format"),
  middlewareValidator,
];

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid is format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name is too short"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((val, { req }) =>
      User.findOne({ email: val }).then((email) => {
        if (email)
          return Promise.reject(new Error("This email is already in use"));
        return true;
      })
    ),
  middlewareValidator,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid is format"),
  middlewareValidator,
];

exports.updatePasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid id"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 charcters")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm)
        throw new Error("Password and password confirm is not matched");
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("PassowrConfirm is required"),

  middlewareValidator,
];

exports.resetPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 charcters"),

  middlewareValidator,
];
