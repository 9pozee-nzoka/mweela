import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// ✅ Get or Create the user's cart
export const getOrCreateCart = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ user: userId }).populate("items.product", "name price");

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalAmount: 0 });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error("❌ getOrCreateCart error:", err);
    res.status(500).json({ error: "Failed to get/create cart", details: err.message });
  }
};

// ✅ Add or update an item in the user's cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalAmount: 0 });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    // recalc total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("❌ addToCart error:", err);
    res.status(500).json({ error: "Failed to add to cart", details: err.message });
  }
};

// ✅ Remove an item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("❌ removeFromCart error:", err);
    res.status(500).json({ error: "Failed to remove item", details: err.message });
  }
};
