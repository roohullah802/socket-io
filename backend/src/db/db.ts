import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/");
    console.log(`mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    throw error;
  }
};
