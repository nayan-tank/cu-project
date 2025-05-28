const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const paymentRoutes = require("./routes/shop/create-order");
const commonFeatureRouter = require("./routes/common/feature-routes");
const commonGalleryRouter = require("./routes/common/gallery-routes");
const adminUserRouter = require("./routes/admin/user-routes")

const { checkAdminRole } = require("./middleware/authMiddleware");

require('dotenv').config();

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.ALLOW_ORIGIN,
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Admin
app.use("/api/auth", authRouter);
app.use("/api/admin/products", checkAdminRole, adminProductsRouter);
app.use("/api/admin/orders", checkAdminRole, adminOrderRouter);
app.use("/api/admin/users", checkAdminRole, adminUserRouter)
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/common/gallery", commonGalleryRouter);

// User
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, "0.0.0.0", () => console.log(`Server is now running on port ${PORT}`));
