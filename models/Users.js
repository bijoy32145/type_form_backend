import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  picture: String,
  lastPage: { type: String, default: null }, 
  lastQuestionId: { type: Number, default: null },
  gp: { type: Number, default: 0 }, 

});

export default mongoose.model("User", userSchema);
