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
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

// ✅ Create a ComponentLoader
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
            key: "image", // field in MongoDB
            file: "image", // virtual field for upload
          },
          uploadPath: (record, filename) => `products/${Date.now()}-${filename}`,
          componentLoader, // ✅ attach loader here
        }),
      ],
    },
    { resource: User, options: { parent: { name: "User Management" } } },
    { resource: Order, options: { parent: { name: "User Management" } } },
    { resource: Cart, options: { parent: { name: "Shop" } } },
  ],
  rootPath: "/admin",
  componentLoader, // ✅ add here too
});

// middleware
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// admin router
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// health check
app.get("/", (req, res) => res.send("Server is running 🚀"));

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🛠️ AdminJS Panel: http://localhost:${PORT}/admin`);
});
