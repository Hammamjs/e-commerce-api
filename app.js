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
const mount = require('./Routes/index');

const globalErrorMiddleware = require("./Middleware/GlobalMiddleware");
const { webhookCheckout } = require("./Services/OrderServices");

// Middleware
// DataBase
DataBase();

app.use(cors());
app.options("*", cors());

const app = express();

app.use(express.urlencoded({ extended: false }));



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
 mount(app)

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
