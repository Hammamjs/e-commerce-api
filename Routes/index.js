const CategoryRoutes = require("../Routes/CategoryRoutes");
const subCategoryRoutes = require("../Routes/SubCategoryRoutes");
const BrandRoutes = require("../Routes/BrandRoutes");
const ProductRoutes = require("../Routes/ProductRoutes");
const UserRoutes = require("../Routes/UserRoutes");
const AuthRoutes = require("../Routes/AuthRoutes");
const CouponRoutes = require("../Routes/CouponRoutes");
const AddressRoutes = require("../Routes/AddressRoutes");
const WishlistRoutes = require("../Routes/WishlistRoutes");
const CartRoutes = require("../Routes/CartRoutes");
const ReviewRoutes = require("../Routes/ReviewsRoutes");
const OrderRoutes = require("../Routes/OrderRoutes");

const mount = (app) => {
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
}

module.exports = mount;