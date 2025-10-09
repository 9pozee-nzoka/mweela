import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

/* ----------------------------
📦 MULTER STORAGE SETUP
---------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save uploaded images to backend/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 17282438823.jpg
  }
});

const upload = multer({ storage });

/* ----------------------------
🆕 CREATE PRODUCT
---------------------------- */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required" });
    }

    const product = new Product({
      name,
      price,
      description,
      category: category.toLowerCase(),
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------
📋 FETCH ALL PRODUCTS
---------------------------- */
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

/* ----------------------------
🏷️ FETCH PRODUCTS BY CATEGORY
---------------------------- */
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category.toLowerCase() });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------
🖼️ STATIC FILES FOR IMAGES
---------------------------- */
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default router;
