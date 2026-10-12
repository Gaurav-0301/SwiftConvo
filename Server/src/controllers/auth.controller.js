const reg = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../lib/cloudinary.lib.js");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await reg.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already used! Try another account.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await reg.create({
      name,
      email,
      password: hashedPassword,
    });

    const uId = user._id.toString().slice(0, 10);
    const updatedUser = await reg.findByIdAndUpdate(
      user._id,
      { uid: uId },
      { new: true }
    ).select("-password");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? (process.env.CLIENT_URL ? "none" : "strict") : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      uid: updatedUser.uid,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Sign up failed: " + error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await reg.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Ensure user has a uid
    if (!user.uid) {
      user.uid = user._id.toString().slice(0, 10);
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? (process.env.CLIENT_URL ? "none" : "strict") : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      uid: user.uid,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed: " + error.message,
    });
  }
};

const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? (process.env.CLIENT_URL ? "none" : "strict") : "lax",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await reg.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("ProfileUpdate Error:", error);
    res.status(500).json({ message: "Profile update failed: " + error.message });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in CheckAuthController:", error);
    res.status(500).json({
      message: "Error in CheckAuthController",
    });
  }
};

module.exports = { login, signup, logout, updateProfile, checkAuth };