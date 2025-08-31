import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

class AuthController {
  /**
   * Google Login Handler
   * @route POST /api/auth/google_login
   */
  static async googleLogin(req, res) {
    try {
      const { token, referrerCode } = req.body; // ✅ get referrerCode from frontend if exists
  
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
  
      // 1️⃣ Fetch Google profile
      const googleRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { sub, email, name, picture } = googleRes.data;
  
      // 2️⃣ Find or create user
      let user = await User.findOne({ googleId: sub });
  
      if (!user) {
        let referrer = null;
        if (referrerCode) {
          referrer = await User.findOne({ referralCode: referrerCode });
        }
  
        user = await User.create({
          googleId: sub,
          email,
          name,
          picture,
          whoReferred: referrer ? referrer._id : null, // ✅ store referrer if valid
        });
  
        // ✅ reward referrer immediately if found
        if (referrer) {
          await User.findByIdAndUpdate(referrer._id, { $inc: { gp: 500 } });
        }
      }
  
      // 3️⃣ Create JWT
      const jwtPayload = { id: user._id, email: user.email };
      const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({ data: user, message: "Login successful" });
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      return res.status(401).json({ message: "Invalid Google token" });
    }
  }
  

   static async updateUserProgress(req, res) {
    try {
      const { userId, lastPage, lastQuestionId } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { lastPage, lastQuestionId },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Failed to update progress", details: err });
    }
  }

  static async getUserById(req, res) {try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("lastPage lastQuestionId email name");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
  }

  static async updateGp(req, res) {
    try {
      const { userId, gp } = req.body;
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { gp } }, // increase GP instead of overwriting
        { new: true }
      );
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // controllers/userController.js

static async rewardReferrer(req, res) {
  try {
    const { referrerCode, newUserId } = req.body;

    // Find referrer by referralCode
    const referrer = await User.findOneAndUpdate(
      { referralCode: referrerCode },
      { $inc: { gp: 500 } }, // give 500 GP to referrer
      { new: true }
    );

    if (!referrer) {
      return res.status(404).json({ error: "Referrer not found" });
    }

    // You could also mark the new user as "referredBy"
    await User.findByIdAndUpdate(newUserId, { referredBy: referrer._id });

    res.json({
      message: "Referral bonus applied!",
      referrer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

static async updateUser(req, res) {
  try {
    const { userId, firstName, lastName, gender, dob, whatsapp } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, gender, dob, whatsapp },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
}



}

export default AuthController;
