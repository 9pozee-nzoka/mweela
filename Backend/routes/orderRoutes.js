import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create new order
router.post("/", async (req, res) => {
  try {
    const { userId, cartId, shippingAddress, paymentMethod } = req.body;

    const order = new Order({
      userId,
      cart: cartId,
      shippingAddress,
      paymentMethod,
      status: "Pending",
    });

    await order.save();

    // 🔹 Push order reference to User
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get customer orders
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("cart");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
