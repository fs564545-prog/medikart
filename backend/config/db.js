import mongoose from 'mongoose';
import dns from "dns"

dns.setServers(['8.8.8.8']);
const connectDB = async () => {
  try {
    console.log("URI from env:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medikart', {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    console.log("⚠️ Running in Mock Mode - data will be served from controllers.");
  }
};

export default connectDB;
