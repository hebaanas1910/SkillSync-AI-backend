const express = require("express");
const router = express.Router();

// 🧭 Sample career learning paths
const skillPaths = {
  "Machine Learning Engineer": [
    "1. Python Basics",
    "2. Data Structures & Algorithms",
    "3. Pandas & NumPy",
    "4. Matplotlib & Seaborn",
    "5. Supervised & Unsupervised Learning",
    "6. Deep Learning (CNNs, RNNs)",
    "7. Build Real-World ML Projects",
    "8. Model Deployment using Flask/Streamlit"
  ],
  "Full Stack Developer": [
    "1. HTML, CSS, JavaScript",
    "2. React.js Fundamentals",
    "3. Node.js & Express.js",
    "4. MongoDB & Mongoose",
    "5. REST APIs & Postman",
    "6. Authentication with JWT",
    "7. CI/CD + Vercel/Render Deployment",
    "8. Full Stack Portfolio Project"
  ]
};

// 🎯 POST /api/learning-path
router.post("/", (req, res) => {
  const { careerGoal } = req.body;

  if (!careerGoal || !skillPaths[careerGoal]) {
    return res.status(400).json({ error: "⚠️ Invalid or missing career goal." });
  }

  const roadmap = skillPaths[careerGoal];
  res.status(200).json({
    success: true,
    message: `✅ Roadmap generated for ${careerGoal}`,
    careerGoal,
    roadmap,
  });
});

module.exports = router;
