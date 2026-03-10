import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    image: { type: String }, // stores path like 'products/xxxx.png'

    category: {
      type: String,
      enum: ["junior", "primary", "construction", "other"],
      default: "other",
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;