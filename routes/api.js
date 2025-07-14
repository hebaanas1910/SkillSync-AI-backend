const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// Leaderboard GET
router.get("/leaderboard", async (req, res) => {
  const scores = await Score.find().sort({ score: -1 }).limit(50);
  res.json(scores);
});

// Submit Score POST
router.post("/submit-score", async (req, res) => {
  const { name, score, level, timeTaken } = req.body;
  const newScore = new Score({ name, score, level, timeTaken });
  await newScore.save();
  res.status(201).json({ message: "Score submitted!" });
});

// AI Explanation (mock response for now)
router.post("/ai-explanation", (req, res) => {
  const { code, question } = req.body;
  return res.json({ explanation: `The expected logic was missing a key part in your solution.` });
});

module.exports = router;
