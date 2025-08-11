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
      const { token } = req.body; // <-- This is access_token from frontend

      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }

      console.log(token, "🚀 Google login request received");
      // 1️⃣ Fetch Google profile using access_token
      const googleRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(googleRes.data, "🚀 Google profile fetched");

      const { sub, email, name, picture } = googleRes.data;

      // // 2️⃣ Find or create user
      let user = await User.findOne({ googleId: sub });
      console.log(user, "🚀 User found or created");
      if (!user) {
        user = await User.create({
          googleId: sub,
          email,
          name,
          picture,
        });
      }

      console.log(user, "🚀 User created");

      // 3️⃣ Create your JWT
      const jwtPayload = { id: user._id, email: user.email };
      const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // 4️⃣ Send as cookie + JSON
      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ data:user,message: "Login successful" });
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      return res.status(401).json({ message: "Invalid Google token" });
    }
  }
}

export default AuthController;
