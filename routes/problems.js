// routes/problems.js
const express = require('express');
const Problem = require('../models/Problem');
const router = express.Router();

router.get('/problems', async (req, res) => {
  const { difficulty, category } = req.query;
  try {
    let filters = {};
    if (difficulty) filters.difficulty = difficulty;
    if (category) filters.category = category;
    
    const problems = await Problem.find(filters);
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

module.exports = router;
