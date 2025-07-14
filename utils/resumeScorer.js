const scoreResume = (text, extractedSkills = []) => {
  let score = 0;
  const lowerText = text.toLowerCase();

  const sections = ["education", "experience", "projects", "skills", "certifications"];
  sections.forEach((section) => {
    if (lowerText.includes(section)) score += 10;
  });

  const skillScore = Math.min(extractedSkills.length * 3, 30); // max 30
  score += skillScore;

  if (lowerText.includes("achievements") || lowerText.includes("awards")) score += 10;

  return Math.min(score, 100);
};

module.exports = { scoreResume };
