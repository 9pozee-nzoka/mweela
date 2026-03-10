import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

/* ----------------------------
📦 MULTER STORAGE SETUP
---------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("uploads/products");
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Clean filename: timestamp-sanitizedname.ext
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed!"));
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/* ----------------------------
🆕 CREATE PRODUCT
---------------------------- */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !category) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Name, price, and category are required." });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      description: description?.trim(),
      category: category.toLowerCase(),
      image: req.file ? `products/${req.file.filename}` : null, // matches AdminJS format
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
    const filter = category ? { category: category.toLowerCase() } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
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
    console.error("Error fetching category:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------
🟨 FETCH SINGLE PRODUCT
---------------------------- */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------
✏️ UPDATE PRODUCT
---------------------------- */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const { name, price, description, category } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (price) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description.trim();
    if (category) updateData.category = category.toLowerCase();

    // Handle image update
    if (req.file) {
      const oldProduct = await Product.findById(req.params.id);
      
      // Delete old image if exists
      if (oldProduct?.image) {
        const oldPath = path.resolve("uploads", oldProduct.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.image = `products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(product);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------
🟥 DELETE PRODUCT (with image cleanup)
---------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Delete associated image
    if (product.image) {
      const imagePath = path.resolve("uploads", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;