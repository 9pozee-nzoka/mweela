import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who placed order
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true }, // what was in cart
  status: {
    type: String,
    enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"],
    default: "Pending",
  },
  totalAmount: { type: Number, required: true }, // snapshot of total price at checkout
  paymentMethod: { type: String, enum: ["Cash", "Card", "Mpesa"], default: "Cash" },
  invoiceNumber: { type: String, unique: true }, // auto-generate for invoice
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
