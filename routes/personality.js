import express from "express";
import { 
  generatePersonality, 
  getPersonalityResult, 
  updatePersonalityResult, 
  deletePersonalityResult 
} from "../controllers/chatController.js";

const router = express.Router();

// Generate new personality result
router.post("/generate", generatePersonality);

// Get existing personality result
router.get("/get/:userId", getPersonalityResult);

// Update existing personality result
router.put("/update/:userId", updatePersonalityResult);

// Delete personality result (for retaking test)
router.delete("/delete/:userId", deletePersonalityResult);

export default router;