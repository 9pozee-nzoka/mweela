import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    image: { type: String }, // store relative path like 'products/xxxx.png'

    category: {
      type: String,
      enum: ["junior", "primary", "construction", "other"],
      default: "other",
      lowercase: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Product = mongoose.model("Product", productSchema);

export default Product;
