import express from "express";
import QuestionAndAnswerController from "../controllers/questionAndAnswerController.js";

const router = express.Router();

router.get("/get_questions_and_answers", QuestionAndAnswerController.getAllQuestionsAndAnswers);
router.post("/save_questions_and_answers", QuestionAndAnswerController.saveQuestionAndAnswer);
router.put("/questions_and_answers/:id", QuestionAndAnswerController.updateQuestionAndAnswer);

// routes/questionAndAnswerRoutes.js
router.get("/get_answer/:userId/:questionId", QuestionAndAnswerController.getAnswerByQuestion);
  

export default router;