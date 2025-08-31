// models/Users.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  firstName: String,
  lastName: String,
  gender: String,
  dob: Date,
  whatsapp: String,
  picture: String,
  lastPage: { type: String, default: null },
  lastQuestionId: { type: Number, default: null },
  gp: { type: Number, default: 0 },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  referralCode: { type: String },
  whoReferred: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // track referrer

});

export default mongoose.model("User", userSchema);
