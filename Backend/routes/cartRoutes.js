import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true }); // important

// POST new cart for a user
router.post("/", async (req, res) => {
  try {
    const userId = req.params.userId; // from URL
    const { items } = req.body;

    if (!items || !items.length) throw new Error("No items provided");

    let totalAmount = 0;
    const cartItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        totalAmount += product.price * item.quantity;
        return { product: item.productId, quantity: item.quantity, price: product.price };
      })
    );

    const cart = new Cart({ userId, items: cartItems, totalAmount });
    await cart.save();

    await User.findByIdAndUpdate(userId, { $push: { carts: cart._id } });

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
