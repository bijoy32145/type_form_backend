import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import questionAndAnswerRoutes from "./routes/questionandanswer.js";
import personalityRoutes from "./routes/personality.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 3002;
const hostname = process.env.HOST || "localhost";

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection - FIXED VERSION
const mongoURI = process.env.MONGO_URI;
console.log("Connecting to MongoDB..."); // Debug line

mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Full error:", err);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions_and_answers", questionAndAnswerRoutes);
app.use("/api/personality", personalityRoutes);

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});