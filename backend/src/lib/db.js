


import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Get the MongoDB URI directly from process.env
    const conn = await mongoose.connect(process.env.mongo_url);
    
    console.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MONGODB:", error);
    process.exit(1);
  }
};