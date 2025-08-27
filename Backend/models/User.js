import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // hash before saving
    avatarUrl: { type: String, default: "" },   // optional profile picture
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("User", userSchema);
