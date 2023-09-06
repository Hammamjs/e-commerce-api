const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImg,
  resizeUserImg,
  updatePassword,
} = require("../Services/UserServices");
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  updatePasswordValidator,
} = require("../utils/Validation/UserValidation");

const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImg, resizeUserImg, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImg, resizeUserImg, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/:id/update-password")
  .put(updatePasswordValidator, updatePassword);

module.exports = router;
