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
  credentials: true, // important to allow cookies
}));
app.use(express.json());
app.use(cookieParser());




// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    process.exit(1); // Stop the app if DB fails
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions_and_answers", questionAndAnswerRoutes);
app.use("/api/personality", personalityRoutes);

app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`);
  });
