import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// --- Import http and Socket.IO Server ---
import http from "http";
import { Server } from "socket.io";

// Your route, database, and custom environment imports
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import msgRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

// --- Configuration for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = ENV.PORT || 3000;

// --- Create HTTP Server and Socket.IO Instance ---
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// --- Middleware ---
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

// --- Production build setup ---
if (ENV.NODE_ENV === "production") {
  // ... (Your production code is fine)
}

// --- Socket.IO Connection Logic ---
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Add more socket event listeners here
});

// --- Start Server ---
// ❗️ IMPORTANT: Listen on the httpServer, NOT the app
httpServer.listen(port, () => {
  console.log("Server is listening on " + port);
  connectDB();
});