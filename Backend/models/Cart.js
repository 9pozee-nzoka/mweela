import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // snapshot of product price
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // later link to a real User model
  items: [cartItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
