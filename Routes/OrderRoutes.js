const express = require("express");

const router = express.Router();

const auth = require("../Services/AuthService");
const {
  checkoutSession,
  createCashOrder,
  filterOrderForLoggedUser,
  getAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
} = require("../Services/OrderServices");

router.use(auth.protect);

router.get(
  "/checkout-session/:cartId",
  auth.allowedTo("user"),
  checkoutSession
);

router.route("/:cartId").post(auth.allowedTo("user"), createCashOrder);

router.get(
  "/",
  auth.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.get("/:id", findSpecificOrder);

router.put("/:id/pay", auth.allowedTo("admin", "manager"), updateOrderToPaid);
router.put(
  "/:id/deliver",
  auth.allowedTo("admin", "manager"),
  updateOrderToDeliverd
);

module.exports = router;
