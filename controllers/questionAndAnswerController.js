import axios from "axios";
import QuestionAndAnswer from "../models/QuestionAndAnswer.js";

class QuestionAndAnswerController {
  /**
   * Get all questions and answers
   * @route GET /api/questions_and_answers
   */
  static async getAllQuestionsAndAnswers(req, res) {
    try {
      const questionsAndAnswers = await QuestionAndAnswer.find();
      return res.status(200).json(questionsAndAnswers);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

/**
 * Get answer by questionId for a user
 * @route GET /api/questions_and_answers/:userId/:questionId
 */
static async getAnswerByQuestion(req, res) {
    try {
      const { userId, questionId } = req.params; // ✅ use params for GET
  
      const savedAnswer = await QuestionAndAnswer.findOne({
        user_id: userId,       // 👈 make sure field names match your schema
        question_id: questionId,
      });
  
      if (!savedAnswer) {
        return res.status(404).json({ message: "No answer found" });
      }
  
      return res.status(200).json(savedAnswer);
    } catch (err) {
      console.error("Error in getAnswerByQuestion:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  
  
  

/**
 * Save or update a question and answer
 * @route POST /api/questions_and_answers/save_questions_and_answers
 */
static async saveQuestionAndAnswer(req, res) {
    try {
      const { user_id, question, subText, answer,question_id } = req.body;

      console.log(user_id, question, subText, answer,question_id);
  
      if (!user_id || !question || !subText || !answer) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const updated = await QuestionAndAnswer.findOneAndUpdate(
        { user_id, question_id }, // match by user + question
        { user_id, question, subText, answer ,question_id},
        { upsert: true, new: true } // update if exists, create if not
      );
  
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  

  /**
   * Update a question and answer
   * @route PUT /api/questions_and_answers/:id
   */
  static async updateQuestionAndAnswer(req, res) {
    try {
      const { id } = req.params;
      const { question, subText, answer } = req.body;

      const updatedQuestionAndAnswer = await QuestionAndAnswer.findByIdAndUpdate(
        id,
        {
          question,
          subText,
          answer,
        },
        { new: true }
      );

      return res.status(200).json(updatedQuestionAndAnswer);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default QuestionAndAnswerController;