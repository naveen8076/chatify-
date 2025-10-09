// backend/middleware/auth.middlware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    // read the cookie named "token" (matches generateToken)
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    if (!ENV.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      console.log("Token verification error:", err.message);
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
