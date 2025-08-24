// controllers/personalityController.js
import { generatePersonalityResult } from "../openaiService.js";
import QuestionAndAnswer from "../models/QuestionAndAnswer.js";

export async function generatePersonality(req, res) {
  try {
    const { userId } = req.body;

    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    console.log(userId, "bijoy");

    const answers = await QuestionAndAnswer.find({ user_id: userId }).sort({ question_id: 1 });

    console.log(answers,"bijoy");


    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: "No answers found" });
    }

    const allAnswers = answers.map(a => a.answer);

    const personalityReport = await generatePersonalityResult(allAnswers);

    return res.status(200).json({ result: personalityReport });
  } catch (err) {
    console.error("Error in controller:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
