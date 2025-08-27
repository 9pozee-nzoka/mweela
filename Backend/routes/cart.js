import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Create new cart / order
router.post("/", async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Calculate total
    let totalAmount = 0;
    const cartItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        const price = product.price;
        totalAmount += price * item.quantity;

        return {
          product: item.productId,
          quantity: item.quantity,
          price,
        };
      })
    );

    const cart = new Cart({ userId, items: cartItems, totalAmount });
    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get customer orders
router.get("/:userId", async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.params.userId }).populate("items.product");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
