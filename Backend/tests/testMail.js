// backend/tests/testMail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// Fix path for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("SMTP_USER from env:", process.env.SMTP_USER);
console.log("SMTP_PASS from env:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ Missing");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test email
async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Mweela Test" <${process.env.SMTP_USER}>`,
      to: "your@email.com",
      subject: "Test Nodemailer",
      text: "Hello, this is a test email from Nodemailer + Gmail.",
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Test email failed:", err);
  }
}

sendTestEmail();
