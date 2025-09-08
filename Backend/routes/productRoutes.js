// Backend/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to backend/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create product with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
