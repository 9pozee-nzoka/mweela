// routes/admin.js
import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Example: Admin Dashboard
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ msg: `Welcome Admin: ${req.user.id}` });
});

export default router;
