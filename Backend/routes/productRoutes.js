import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save uploaded images to backend/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * 🟩 CREATE PRODUCT (with image upload)
 * POST /api/products
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // ✅ Validate category
    const allowedCategories = ["junior", "primary", "secondary", "general", "construction"];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const product = new Product({
      name,
      price,
      description,
      category: category || "general",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🟦 FETCH PRODUCTS (optionally filtered by category)
 * GET /api/products
 * Example: /api/products?category=primary
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🟨 FETCH SINGLE PRODUCT BY ID
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🟥 DELETE PRODUCT
 * DELETE /api/products/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
