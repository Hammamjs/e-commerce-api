const express = require("express");

const router = express.Router();
const auth = require("../Services/AuthService");
const {
  getLoggedUserAddresses,
  addAddress,
  removeAddress,
} = require("../Services/AddressService");

router.use(auth.protect, auth.allowedTo("user"));

router.route("/").get(getLoggedUserAddresses).post(addAddress);
router.delete("/:addressId", removeAddress);

module.exports = router;
