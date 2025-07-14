const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📥 Register Route - POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "⚠️ Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Student", // default role
      status: "Pending", // default status
    });

    res.status(201).json({ message: "✅ Registration successful", userId: newUser._id });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "❌ Registration failed. Try again later." });
  }
});

// 🔐 Login Route - POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "❌ User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "❌ Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "❌ Login failed. Try again later." });
  }
});

module.exports = router;
