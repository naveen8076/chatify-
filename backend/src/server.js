import express, { Router } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import msgRoutes from "./routes/msg.route.js";
import path from "path";
// CORRECT
import { connectDB } from "./lib/db.js";
const __dirname = path.resolve();
dotenv.config();
const app = express();
const port = process.env.PORT || 3000
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/msg", msgRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, ()=>{
  console.log("server is lsitening on "+port)
   connectDB();
})




