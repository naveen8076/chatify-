// backend/lib/util.js
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

/**
 * Generates a JWT and sets it as a secure, cross-site cookie for Render.
 * Works with frontend at https://buzzchat-29gn.onrender.com
 */
export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  // create the JWT
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // set cookie with proper flags for cross-site Render setup
  res.cookie("token", token, {
    httpOnly: true,                  // hidden from JavaScript
    secure: ENV.NODE_ENV === "production", // true on Render HTTPS
    sameSite: "None",                // allow cross-site cookie
    path: "/",                       // valid for all routes
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
