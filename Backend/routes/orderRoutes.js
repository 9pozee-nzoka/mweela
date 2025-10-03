import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";

const router = express.Router({ mergeParams: true });

// 🛒 Get all orders for a user
// GET /api/orders/:userId
router.get("/:userId", getUserOrders);

// 🛒 Create an order for a user
// POST /api/orders/:userId
router.post("/:userId", createOrder);

export default router;
