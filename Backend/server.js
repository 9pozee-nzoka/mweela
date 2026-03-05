import express from "express";
import mongoose from "mongoose";
import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import uploadFeature from "@adminjs/upload";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
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

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ connect DB
connectDB();

// ✅ register mongoose adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// ✅ create componentLoader for custom components
const componentLoader = new AdminJS.ComponentLoader();

// ✅ setup AdminJS
const adminJs = new AdminJS({
  resources: [
    {
      resource: Product,
      options: { parent: { name: "Shop" } },
      features: [
        uploadFeature({
          provider: { local: { bucket: uploadDir } },
          properties: {
            key: "image", // saved in MongoDB
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

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:52513", // Angular dev
  "http://localhost:3000", // API testing
  // "https://your-production-domain.com", // add your prod frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps / curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed from this origin"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ handle OPTIONS preflight
app.options("*", cors());

// ✅ middlewares
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// ✅ admin router
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

// ✅ API routes (no params here)
console.log("Mounting authRoutes at /api/auth");
app.use("/api/auth", authRoutes);

console.log("Mounting adminRoutes at /api/admin");
app.use("/api/admin", adminRoutes);

console.log("Mounting productRoutes at /api/products");
app.use("/api/products", productRoutes);

console.log("Mounting userRoutes at /api/users");
app.use("/api/users", userRoutes);

console.log("Mounting orderRoutes at /api/orders");
app.use("/api/orders", orderRoutes);

console.log("Mounting cartRoutes at /api/carts");
app.use("/api/carts", cartRoutes);

// ✅ health check
app.get("/", (req, res) => res.send("Server is running 🚀"));

// ✅ error handler
app.use((err, req, res, next) => {
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

// ✅ start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🛠️ AdminJS Panel: http://localhost:${PORT}/admin`);
});


// Utility function to recursively get routes
function printRoutes(stack, prefix = "") {
  stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      const path = prefix + middleware.route.path;
      const methods = Object.keys(middleware.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`[ROUTE] ${methods} ${path}`);
    } else if (middleware.name === "router" && middleware.handle.stack) {
      // router middleware
      const newPrefix = middleware.regexp.source
        .replace("^\\", "")
        .replace("\\/?(?=\\/|$)", "");
      printRoutes(middleware.handle.stack, prefix + "/" + newPrefix);
    }
  });
}

// After all app.use() calls
console.log("🔎 All registered routes:");
printRoutes(app._router.stack);