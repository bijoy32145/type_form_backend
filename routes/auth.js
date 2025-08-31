import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/google_login", AuthController.googleLogin);
router.post("/update_progress", AuthController.updateUserProgress);
router.get("/:userId", AuthController.getUserById);
router.post("/update_gp", AuthController.updateGp);
router.post("/update_user", AuthController.updateUser);


export default router;
