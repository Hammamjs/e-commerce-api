const path = require("path");
const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const hpp = require("hpp");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "config.env" });

// Customize Files

const DataBase = require("./DataBase/db");
const ApiError = require("./utils/ApiError");

// Routes file

const CategoryRoutes = require("./Routes/CategoryRoutes");
const subCategoryRoutes = require("./Routes/SubCategoryRoutes");
const BrandRoutes = require("./Routes/BrandRoutes");
const ProductRoutes = require("./Routes/ProductRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const AuthRoutes = require("./Routes/AuthRoutes");
const CouponRoutes = require("./Routes/CouponRoutes");
const AddressRoutes = require("./Routes/AddressRoutes");
const WishlistRoutes = require("./Routes/WishlistRoutes");
const CartRoutes = require("./Routes/CartRoutes");
const ReviewRoutes = require("./Routes/ReviewsRoutes");
const OrderRoutes = require("./Routes/OrderRoutes");

const globalErrorMiddleware = require("./Middleware/GlobalMiddleware");
const { webhookCheckout } = require("./Services/OrderServices");

// Middleware
// DataBase
DataBase();

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.options("*", cors());

app.use(compression());

// checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// parsing input
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// parser cookies
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode is ${process.env.NODE_ENV}`);
}

// sanitize data
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too Many request from this IP please wait for couple minutes",
});

app.use("/api/forgot-password", limiter);

// HTTP prameter pollution
app.use(
  hpp({
    whitelist: ["price", "quantity", "sold"],
  })
);

// Mount Route
app.use("/api/v2/categories", CategoryRoutes);
app.use("/api/v2/subcategories", subCategoryRoutes);
app.use("/api/v2/brands", BrandRoutes);
app.use("/api/v2/products", ProductRoutes);
app.use("/api/v2/users", UserRoutes);
app.use("/api/v2/auth", AuthRoutes);
app.use("/api/v2/coupons", CouponRoutes);
app.use("/api/v2/addresses", AddressRoutes);
app.use("/api/v2/wishlist", WishlistRoutes);
app.use("/api/v2/cart", CartRoutes);
app.use("/api/v2/reviews", ReviewRoutes);
app.use("/api/v2/orders", OrderRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Route not Exist ${req.originalUrl}`, 400));
});

app.use(globalErrorMiddleware);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server Start at Port: ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down server`);
    process.exit(1);
  });
});
