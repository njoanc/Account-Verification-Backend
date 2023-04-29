import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let dbUrl;

if (process.env.NODE_ENV === "test") {
  dbUrl = process.env.MONGODB_URL_TEST;
} else {
  dbUrl = process.env.MONGODB_URL;
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
