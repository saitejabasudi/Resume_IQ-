import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import formidable from "formidable";
import fs from "fs";

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
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Form parsing failed" });
      }

      const file = files.resume;
      const jobDescription = fields.jobDescription || "";

      if (!file) {
        return res.status(400).json({ error: "No resume uploaded" });
      }

      const fileBuffer = fs.readFileSync(file.filepath);

      let text = "";

      if (file.mimetype === "application/pdf") {
        const data = await pdfParse(fileBuffer);
        text = data.text;
      } else {
        const result = await mammoth.extractRawText({
          buffer: fileBuffer,
        });
        text = result.value;
      }

      const atsResult = analyzeResume(text);
      const jobMatchResult = matchJobDescription(text, jobDescription);

      res.status(200).json({
        success: true,
        atsScore: atsResult.score,
        foundSkills: atsResult.foundSkills,
        jobMatch: jobMatchResult
      });
    });

  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
      }
