// routes/personalityRoutes.js
import express from "express";
import { generatePersonality } from "../controllers/chatController.js";

const router = express.Router();

router.post("/generate", generatePersonality);

export default router;
