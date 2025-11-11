import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path if needed

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

async function fixPasswords() {
  try {
    const users = await User.find();

    for (const user of users) {
      console.log(`\nUser: ${user.email}`);

      // Ask for the correct plaintext password you want to reset
      const correctPassword = "Pozee@5268"; // Replace with actual password for this user

      // Hash the correct password
      const hashed = await bcrypt.hash(correctPassword, 10);

      // Update user password in DB
      user.password = hashed;
      await user.save();

      console.log(`✅ Password reset for ${user.email}`);
    }

    console.log("\nAll passwords updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating passwords:", err);
    process.exit(1);
  }
}

fixPasswords();
