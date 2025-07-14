const express = require("express");
const router = express.Router();
const Score = require("../models/Score"); // Make sure this model exists

// GET leaderboard route
router.get("/leaderboard", async (req, res) => {
  try {
    const data = await Score.find().sort({ score: -1, timeTaken: 1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err });
  }
});

module.exports = router;
