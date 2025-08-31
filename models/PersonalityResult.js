// models/PersonalityResult.js
import mongoose from "mongoose";

const PersonalityResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true // Ensure one result per user
  },
  mbtiCode: {
    type: String,
    required: true
  },
  archetypeTitle: {
    type: String,
    required: true
  },
  introduction: {
    type: String,
    required: true
  },
  traits: [{
    type: String
  }],
  insights: [{
    type: String
  }],
  affirmation: {
    type: String,
    required: true
  },
  strength: {
    type: String,
    required: true
  },
  uniqueThing: {
    type: String,
    required: true
  },
  signatureQuote: {
    type: String,
    required: true
  },
  cuteRoast: {
    type: String,
    required: true
  },
  staticText: {
    type: String,
    required: true
  },
  rawResult: {
    type: String, // Store the original formatted result as backup
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.model("PersonalityResult", PersonalityResultSchema);