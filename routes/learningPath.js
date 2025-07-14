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
  ],
    "DevOps Engineer": [
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
    ],
    "Cloud Architect":  [
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
    ],
 
      "UI/UX Designer":[
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
    ],
  

   "Cybersecurity Specialist": [
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
    ],
  

      "Blockchain Developer": [
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
    ],
  

      "AI Researcher": [
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
      ],

          "Game Developer":[
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
    ],
      "Mobile App Developer":[
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
    ],
  

      "Data Engineer":[
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
    ], 

      "Software Architect":[
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
    ],
  

  "Network Engineer": [
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
    ],
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
