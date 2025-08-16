import mongoose from "mongoose";

const questionAndAnswerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question_id: { type: Number, required: true }, // Add this
  question: { type: String, required: true },
  subText: { type: String, required: true },
  answer: { type: String, required: true },
});

export default mongoose.model("QuestionAndAnswer", questionAndAnswerSchema);