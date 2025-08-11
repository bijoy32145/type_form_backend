import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/google_login", AuthController.googleLogin);

export default router;
