const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const learningPathRoute = require("./routes/learningPath");
const { parsePDF } = require("./utils/resumeParser");
const { scoreResume } = require("./utils/resumeScorer");
const { authenticateToken } = require("./middleware/authMiddleware");
const User = require("./models/User");
const leaderboardRoutes = require("./routes/leaderboard");
const chatbotRoutes = require("./routes/chat");

const app = express();

// 🔌 Connect to MongoDB
connectDB();

// 🌐 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// 🔐 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/learning-path", learningPathRoute);
app.use("/api", chatbotRoutes);
app.use("/api", leaderboardRoutes);

// 🗂️ Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 📚 Skill Keywords (expand as needed)
const keywordList = [
  "JavaScript", "Java", "Python", "C++", "React", "Node.js", "Node js",
  "HTML", "CSS", "MongoDB", "SQL", "Machine Learning", "ML",
  "AI", "Artificial Intelligence", "Data Science", "AWS", "Docker", "Kubernetes"
];

// 📤 Resume Upload, Parsing, Scoring
app.post("/api/upload", authenticateToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const extractedText = await parsePDF(filePath);

    const lowerWords = extractedText.toLowerCase().match(/\b\w+(\.\w+)?\b/g) || [];

    const matchedKeywords = keywordList.filter(keyword => {
      const parts = keyword.toLowerCase().split(" ");
      return parts.every(part => lowerWords.includes(part));
    });

    const uniqueSkills = [...new Set(matchedKeywords)];
    await User.findByIdAndUpdate(req.user.id, { skills: uniqueSkills });

    const score = scoreResume(extractedText, uniqueSkills);

    console.log("✅ Skills saved:", uniqueSkills);

    res.json({
      message: "Upload successful",
      file: req.file.filename,
      keywords: uniqueSkills,
      preview: extractedText.slice(0, 500),
      score,
    });
  } catch (err) {
    console.error("❌ Resume parsing error:", err);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

// 💼 Recommend Jobs by Matching Skills
app.get("/recommend-jobs", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userSkills = user.skills || [];

    const jobsDB = [
      { title: "Frontend Developer", skillsRequired: ["JavaScript", "React", "HTML", "CSS"] },
      { title: "Backend Developer", skillsRequired: ["Node.js", "Express", "MongoDB"] },
      { title: "Data Scientist", skillsRequired: ["Python", "Machine Learning"] },
      { title: "Full Stack Developer", skillsRequired: ["JavaScript", "React", "Node.js", "MongoDB"] },
      { title: "AI Engineer", skillsRequired: ["AI", "Python", "Machine Learning", "AWS"] },
    ];

    const recommendedJobs = jobsDB.filter(job => {
      const matched = job.skillsRequired.filter(skill =>
        userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
      );
      return matched.length >= 2;
    });

    console.log("📦 Jobs recommended:", recommendedJobs.length);
    res.json({ recommendedJobs });
  } catch (err) {
    console.error("❌ Error recommending jobs:", err);
    res.status(500).json({ error: "Failed to fetch job recommendations" });
  }
});

// 👑 Admin: Get All Users
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, "name email role status");
    res.json({ users });
  } catch (err) {
    console.error("❌ Admin fetch error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 🚀 Career Path API - New Route
app.post('/api/learning-path', (req, res) => {
  const { careerGoal } = req.body;

  let roadmap = [];

  // All Career Path Logic
  if (careerGoal === "Machine Learning Engineer") {
    roadmap = [
      "Learn Python Fundamentals",
      "Understand Data Structures & Algorithms",
      "Mathematics for Machine Learning",
      "Data Preprocessing",
      "Supervised Learning Algorithms",
      "Unsupervised Learning Algorithms",
      "Deep Learning Fundamentals",
      "Advanced Deep Learning",
      "Natural Language Processing (NLP)",
      "Model Evaluation & Hyperparameter Tuning",
      "ML Deployment & Automation",
      "Real-World Projects"
    ];
  }
  else if (careerGoal === "Full Stack Developer") {
    roadmap = [
      "Learn HTML, CSS, JavaScript Basics",
      "Learn Frontend Frameworks (React, Angular, Vue)",
      "Understand Backend Development (Node.js, Express)",
      "Learn Database Management (MongoDB, MySQL)",
      "Master RESTful APIs",
      "Version Control with Git",
      "Authentication & Authorization (JWT)",
      "Deploy Web Apps (Heroku, AWS)",
      "Unit Testing and Debugging",
      "Build Full Stack Projects"
    ];
    
  }
  // Software Engineer Path
  else if (careerGoal === "Software Engineer") {
    roadmap = [
      "Learn Programming Languages (Java, C++, Python)",
      "Understand Data Structures & Algorithms",
      "Master Object-Oriented Programming",
      "Version Control with Git",
      "Software Development Lifecycle",
      "Web Development (HTML, CSS, JS)",
      "Databases & SQL",
      "Unit Testing & Debugging",
      "Design Patterns",
      "Build Software Projects"
    ];
  }

  // DevOps Engineer Path
  else if (careerGoal === "DevOps Engineer") {
    roadmap = [
      "Learn Linux Fundamentals",
      "Master Cloud Computing (AWS, Azure)",
      "Understand Version Control with Git",
      "Learn Containerization (Docker)",
      "Master CI/CD Pipelines",
      "Automate Infrastructure with Terraform",
      "Monitor Systems & Applications",
      "Security Best Practices",
      "Cloud Native Technologies (Kubernetes)",
      "Real-World DevOps Projects"
    ];
  }

  // Cloud Architect Path
  else if (careerGoal === "Cloud Architect") {
    roadmap = [
      "Learn Cloud Computing Fundamentals",
      "Understand Cloud Providers (AWS, Azure, Google Cloud)",
      "Master Virtualization Technologies",
      "Learn Infrastructure as Code (Terraform, CloudFormation)",
      "Master Cloud Security Best Practices",
      "Design & Architect Cloud Systems",
      "Data Storage & Management in the Cloud",
      "Monitor and Scale Cloud Infrastructure",
      "Serverless Architecture",
      "Real-World Cloud Architecture Projects"
    ];
  }

  // UI/UX Designer Path
  else if (careerGoal === "UI/UX Designer") {
    roadmap = [
      "Learn Design Principles",
      "Understand Wireframing & Prototyping",
      "Master Design Tools (Figma, Sketch, Adobe XD)",
      "User Research & Personas",
      "Create User Flows & Journeys",
      "Design Visual UI Components",
      "Responsive Web Design",
      "Usability Testing & Feedback",
      "Collaborate with Developers",
      "Build UI/UX Portfolio"
    ];
  }

  // Cybersecurity Specialist Path
  else if (careerGoal === "Cybersecurity Specialist") {
    roadmap = [
      "Learn Networking Fundamentals",
      "Understand Encryption and Cryptography",
      "Master Penetration Testing",
      "Learn about Firewalls & VPNs",
      "Network Security Protocols",
      "Security Best Practices (OWASP, etc.)",
      "Learn Ethical Hacking",
      "Incident Response & Disaster Recovery",
      "Security Monitoring & Analysis",
      "Real-World Security Projects"
    ];
  }

  // Blockchain Developer Path
  else if (careerGoal === "Blockchain Developer") {
    roadmap = [
      "Learn Blockchain Fundamentals",
      "Master Smart Contracts (Ethereum, Solidity)",
      "Understand Cryptocurrencies",
      "Blockchain Consensus Algorithms",
      "Blockchain Security & Vulnerabilities",
      "Build Blockchain Applications (DApps)",
      "Master Web3 & Decentralized Systems",
      "Learn about ICOs & Tokenization",
      "Deploy Blockchain Projects",
      "Contribute to Open Source Blockchain Projects"
    ];
  }

  // AI Researcher Path
  else if (careerGoal === "AI Researcher") {
    roadmap = [
      "Understand Machine Learning & Deep Learning",
      "Learn Advanced Mathematics (Linear Algebra, Calculus, Probability)",
      "Master Reinforcement Learning",
      "Natural Language Processing (NLP)",
      "Advanced Neural Networks",
      "Convolutional Neural Networks (CNNs)",
      "Generative Models (GANs)",
      "Research & Publish Papers",
      "Contribute to AI Open Source Projects",
      "Collaborate with Research Communities"
    ];
  }

  // Game Developer Path
  else if (careerGoal === "Game Developer") {
    roadmap = [
      "Learn Programming Languages (C++, C#, Python)",
      "Understand Game Development Frameworks (Unity, Unreal)",
      "Game Physics & AI",
      "Learn about 3D Modeling & Animation",
      "Understand Game Design Principles",
      "Master User Interface (UI) in Games",
      "Build Multiplayer Games",
      "Game Performance Optimization",
      "Test & Debug Games",
      "Publish & Market Games"
    ];
  }

  // Mobile App Developer Path
  else if (careerGoal === "Mobile App Developer") {
    roadmap = [
      "Learn Programming Languages (Java, Swift, Kotlin)",
      "Master Mobile App Development Frameworks (React Native, Flutter)",
      "Understand App Architecture & Design Patterns",
      "UI/UX Design for Mobile Apps",
      "Integrate APIs & Databases",
      "Understand App Security Best Practices",
      "Publish Apps to Play Store & App Store",
      "App Performance Optimization",
      "Test & Debug Mobile Apps",
      "Build & Deploy Real-World Mobile Apps"
    ];
  }

  // Data Engineer Path
  else if (careerGoal === "Data Engineer") {
    roadmap = [
      "Learn Data Modeling & Database Design",
      "Master SQL and NoSQL Databases",
      "Learn Data Warehousing",
      "Understand ETL Processes",
      "Work with Big Data Technologies (Hadoop, Spark)",
      "Master Cloud Data Platforms (AWS, Google Cloud, Azure)",
      "Data Pipeline Development",
      "Learn about Data Streaming (Apache Kafka)",
      "Data Security & Governance",
      "Build Data Engineering Projects"
    ];
  }

  // Software Architect Path
  else if (careerGoal === "Software Architect") {
    roadmap = [
      "Master Software Design Patterns",
      "Understand Architecture Styles (Microservices, Monolithic)",
      "Learn about Cloud-Native Architecture",
      "Master Data Modeling & Database Design",
      "Understand Scalability & Load Balancing",
      "Security in Software Architecture",
      "Performance Tuning & Optimization",
      "Design & Lead Software Projects",
      "Mentor Other Engineers",
      "Contribute to Open Source Projects"
    ];
  }

  // Network Engineer Path
  else if (careerGoal === "Network Engineer") {
    roadmap = [
      "Learn Networking Fundamentals",
      "Understand TCP/IP & OSI Model",
      "Master Routing & Switching",
      "Work with Network Security & Firewalls",
      "Learn about VPN & Proxy Servers",
      "Master Network Troubleshooting",
      "Understand Cloud Networking",
      "Learn about SDN & NFV",
      "Monitor & Optimize Network Performance",
      "Work on Real-World Networking Projects"
    ];
  }
  // Add other career paths here following the same structure
  
  res.json({ roadmap });
});

// ❤️ Health Check
app.get("/", (req, res) => res.send("✅ SkillSync AI Server is live!"));

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
