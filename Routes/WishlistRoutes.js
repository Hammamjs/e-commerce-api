const express = require("express");

const auth = require("../Services/AuthService");
const {
  getloggedUserWishlist,
  addProductToUserWishlist,
  removeProductFromUserWishlist,
} = require("../Services/WishlistService");

const router = express.Router();

router.use(auth.protect, auth.allowedTo("user"));

router.route("/").get(getloggedUserWishlist).post(addProductToUserWishlist);
router.delete("/:productId", removeProductFromUserWishlist);

module.exports = router;
