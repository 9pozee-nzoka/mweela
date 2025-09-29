import express from "express";
import mongoose from "mongoose";
import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import uploadFeature from "@adminjs/upload";
import dotenv from "dotenv";
import connectDB from "./database.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";     // ✅ users
import orderRoutes from "./routes/orderRoutes.js";   // ✅ orders
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// connect DB
connectDB();

// register mongoose adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// ✅ create componentLoader for future custom components
const componentLoader = new AdminJS.ComponentLoader();

// setup AdminJS
const adminJs = new AdminJS({
  resources: [
    {
      resource: Product,
      options: { parent: { name: "Shop" } },
      features: [
        uploadFeature({
          provider: {
            local: { bucket: uploadDir },
          },
          properties: {
            key: "image",   // saved in MongoDB
            file: "upload", // virtual field in the UI
          },
          uploadPath: (record, filename) => `products/${Date.now()}-${filename}`,
        }),
      ],
    },
    { resource: User, options: { parent: { name: "User Management" } } },
    { resource: Order, options: { parent: { name: "User Management" } } },
    { resource: Cart, options: { parent: { name: "Shop" } } },
  ],
  rootPath: "/admin",
  componentLoader,
});

// middleware
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// admin router (unprotected for now)
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);     
app.use("/api/orders", orderRoutes);   // ✅ added
app.use("/api/users/:userId/carts", cartRoutes);

// health check
app.get("/", (req, res) => res.send("Server is running 🚀"));

// error handler (to debug AdminJS errors)
app.use((err, req, res, next) => {
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🛠️ AdminJS Panel: http://localhost:${PORT}/admin`);
});


