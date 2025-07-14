// server/routes/chat.js
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo", // or "gpt-4"
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response.";
    res.json({ response: reply });
  } catch (error) {
    console.error("❌ Chat Error:", error);
    res.status(500).json({ error: "Error fetching response from OpenAI." });
  }
});

module.exports = router;
