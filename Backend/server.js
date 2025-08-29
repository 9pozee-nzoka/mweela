import express from "express";
import mongoose from "mongoose";
import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import dotenv from "dotenv";
import connectDB from "./database.js";
import Product from "./models/Product.js";
import User from "./models/User.js";   // ✅ add this
import Cart from "./models/Cart.js";   // ✅ add this
import Order from "./models/Order.js";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';

const app = express();
const PORT = 3000;
dotenv.config();
// ✅ Connect to MongoDB
connectDB();

// ✅ Register AdminJS Mongoose adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// ✅ AdminJS setup- populating the admin panel with resources
const adminJs = new AdminJS({
  resources: [
    { resource: User, options: { parent: { name: "User Management" } } },
    { resource: Order, options: { parent: { name: "User Management" } } },
    { resource: Product, options: { parent: { name: "Shop" } } },
    { resource: Cart, options: { parent: { name: "Shop" } } },
  ],
  rootPath: "/admin",
});
app.use(cors({
  origin: 'http://localhost:4200', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
  credentials: true, // if you need cookies/auth
}));
// ✅ AdminJS router- calling the buildRouter function
const router = AdminJSExpress.buildRouter(adminJs);

// ✅ Mount admin panel
app.use(adminJs.options.rootPath, router);
app.use(express.json());
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
  res.send("Server is running with MongoDB + AdminJS!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🛠️ AdminJS Panel: http://localhost:${PORT}/admin`);
});

app.listen(3000, () => console.log('Server running on port 3000'));