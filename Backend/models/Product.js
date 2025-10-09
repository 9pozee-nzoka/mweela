// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: { type: String }, // store uploaded image path
  createdAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ["junior", "primary", "", "construction", "other"],
    default: "other",
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
