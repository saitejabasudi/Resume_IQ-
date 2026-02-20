import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const skillKeywords = [
  "javascript", "react", "node", "python", "java",
  "sql", "mongodb", "html", "css", "express",
  "leadership", "communication", "teamwork",
  "problem solving", "data analysis",
  "machine learning", "aws", "docker",
  "git", "api", "frontend", "backend"
];

function analyzeResume(text) {
  let score = 0;
  const lowerText = text.toLowerCase();

  const sections = ["experience", "education", "skills", "projects"];
  sections.forEach(section => {
    if (lowerText.includes(section)) score += 10;
  });

  let foundSkills = [];
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill);
      score += 3;
    }
  });

  if (text.length > 1000) score += 15;
  if (text.match(/\d+/)) score += 10;
  if (text.match(/@[a-zA-Z0-9.-]+/)) score += 5;

  score = Math.min(score, 100);

  return { score, foundSkills };
}

function matchJobDescription(resumeText, jobText) {
  const resume = resumeText.toLowerCase();
  const job = jobText.toLowerCase();

  let matched = [];
  let missing = [];

  skillKeywords.forEach(skill => {
    if (job.includes(skill)) {
      if (resume.includes(skill)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    }
  });

  let matchScore = 0;
  if (matched.length + missing.length > 0) {
    matchScore =
      (matched.length / (matched.length + missing.length)) * 100;
  }

  return {
    matchScore: Math.round(matchScore),
    matched,
    missing
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const dataBuffer = Buffer.concat(buffers);

    let text = "";

    if (req.headers["content-type"]?.includes("pdf")) {
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({
        buffer: dataBuffer,
      });
      text = result.value;
    }

    const atsResult = analyzeResume(text);

    res.status(200).json({
      success: true,
      atsScore: atsResult.score,
      foundSkills: atsResult.foundSkills
    });

  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
}
