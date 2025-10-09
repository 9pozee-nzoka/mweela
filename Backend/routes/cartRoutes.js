import express from "express";
import { getOrCreateCart, addToCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router({ mergeParams: true });

// Get or create a user's cart
router.get("/", getOrCreateCart);

// Add to cart
router.post("/add", addToCart);

// Remove item from cart
router.delete("/:productId", removeFromCart);

export default router;
