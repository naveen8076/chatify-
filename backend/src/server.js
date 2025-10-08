import express, { Router } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import msgRoutes from "./routes/msg.route.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000

app.use("/api/auth", authRoutes)
app.use("/api/msg", msgRoutes)
app.listen(port, ()=>{
  console.log("server is lsitening on "+port)
})




