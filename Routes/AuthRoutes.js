const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  ResetPassword,
  logout,
} = require("../Services/AuthService");
const auth = require("../Services/AuthService");
const {
  signupValidator,
  resetPasswordValidator,
  loginValidator,
} = require("../utils/Validation/AuthValidation");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/logout").post(auth.protect, logout);

router.route("/forgot-password").post(forgotPassword);
router.route("/verify-password").post(verifyPassResetCode);
router.route("/reset-password").put(resetPasswordValidator, ResetPassword);
// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImg, resizeUserImg, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

// router
//   .route("/:id/update-password")
//   .put(updatePasswordValidator, updatePassword);

module.exports = router;
