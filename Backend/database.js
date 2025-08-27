// database.js (ESM)

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://pozee:Pozee5268@cluster0.3awtv3c.mongodb.net/items?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

export default connectDB;
