import express from "express";
import mongoose from "mongoose";
import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { buildAuthenticatedRouter } from "@adminjs/express";
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

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
const productsDir = path.join(uploadDir, "products");
const tempDir = path.join(__dirname, "temp"); // Same filesystem!

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir);
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

const componentLoader = new ComponentLoader();

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// Setup AdminJS with temp directory configuration
const adminJs = new AdminJS({
  resources: [
    {
      resource: Product,
      options: { 
        parent: { name: "Shop" },
        properties: {
          image: {
            isVisible: { list: true, edit: true, filter: false, show: true },
          }
        }
      },
      features: [
        uploadFeature({
          componentLoader,
          provider: { 
            local: { 
              bucket: uploadDir,
              // Some versions support temp directory option
              // Check your @adminjs/upload version docs
            } 
          },
          properties: {
            key: "image",
            file: "uploadFile",
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

// CORS setup
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:52513",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
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

app.options("*", cors());

const adminRouter = buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === "pauljohns730@gmail.com" && password === "Pozee@5268") {
      return { email: 'pauljohns730@gmail.com', role: 'admin' };
    }
    return null;
  },
  cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'some-secret-password-32-chars-long!!',
}, null, {
  resave: false,
  saveUninitialized: true,
  secret: process.env.ADMIN_COOKIE_SECRET || 'some-secret-password-32-chars-long!!',
});

app.use(adminJs.options.rootPath, adminRouter);

// Body parsing after AdminJS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(uploadDir));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);

// Health check
app.get("/", (req, res) => res.send("Server is running 🚀"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ 
    error: "Something went wrong", 
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🛠️ AdminJS Panel: http://localhost:${PORT}/admin`);
});