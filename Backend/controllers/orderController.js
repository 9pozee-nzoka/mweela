// controllers/orderController.js
import Order from "../models/Order.js";
import User from "../models/User.js";

// ✅ Create a new order for a user
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params; // from route
    const { cartId, shippingAddress, paymentMethod } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const order = new Order({
      userId,
      cart: cartId,
      shippingAddress,
      paymentMethod,
      status: "Pending",
    });

    await order.save();

    // Push order reference to user's orders array
    user.orders.push(order._id);
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ createOrder error:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};

// ✅ Get all orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate({
        path: "cart",
        populate: { path: "items.product" }, // populate products inside cart items
      });

    res.json(orders);
  } catch (err) {
    console.error("❌ getUserOrders error:", err);
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
};
