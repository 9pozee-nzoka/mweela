import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get full profile (user + carts + orders)
router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // 🚫 exclude password
      .populate({
        path: "carts",
        populate: { path: "items.product" }, // populate products inside cart items
      })
      .populate({
        path: "orders",
        populate: { path: "cart" }, // populate cart inside orders
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
