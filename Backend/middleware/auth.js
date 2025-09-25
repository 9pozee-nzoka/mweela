// middleware/auth.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// ✅ only allow admins
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};
