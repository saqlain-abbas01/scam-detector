import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    console.log("Connecting to MongoDB...", process.env.DATABASE_URL);
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
