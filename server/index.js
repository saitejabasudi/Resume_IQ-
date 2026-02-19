const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();
const PORT = 5000;

/* ===================================
        SKILL KEYWORDS DATABASE
=================================== */

const skillKeywords = [
  "javascript", "react", "node", "python", "java",
  "sql", "mongodb", "html", "css", "express",
  "leadership", "communication", "teamwork",
  "problem solving", "data analysis",
  "machine learning", "aws", "docker",
  "git", "api", "frontend", "backend"
];

/* ===================================
        ATS ANALYSIS ENGINE
=================================== */

function analyzeResume(text) {
  let score = 0;

  const lowerText = text.toLowerCase();

  // Section check
  const sections = ["experience", "education", "skills", "projects"];
  sections.forEach(section => {
    if (lowerText.includes(section)) score += 10;
  });

  // Keyword check
  let foundSkills = [];
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill);
      score += 3;
    }
  });

  // Length check
  if (text.length > 1000) score += 15;

  // Numbers check
  if (text.match(/\d+/)) score += 10;

  // Email check
  if (text.match(/@[a-zA-Z0-9.-]+/)) score += 5;

  score = Math.min(score, 100);

  return { score, foundSkills };
}

/* ===================================
        JOB MATCH FUNCTION
=================================== */

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

/* ===================================
        ANALYZE API
=================================== */

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });
      text = result.value;
    }

    const atsResult = analyzeResume(text);

    let jobMatchResult = null;

    if (req.body.jobDescription) {
      jobMatchResult = matchJobDescription(
        text,
        req.body.jobDescription
      );
    }

    res.json({
      success: true,
      atsScore: atsResult.score,
      foundSkills: atsResult.foundSkills,
      jobMatch: jobMatchResult
    });

  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

/* ===================================
        GENERATE PDF REPORT API
=================================== */

app.post("/generate-report", upload.single("resume"), async (req, res) => {
  try {
    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });
      text = result.value;
    }

    const atsResult = analyzeResume(text);

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Resume_IQ_Report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Resume IQ Analysis Report", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(16).text(`ATS Score: ${atsResult.score}/100`);

    doc.moveDown();
    doc.fontSize(14).text("Detected Skills:");
    doc.text(atsResult.foundSkills.join(", ") || "None");

    doc.moveDown();
    doc.text("Improvement Suggestions:");
    doc.text("- Add measurable achievements");
    doc.text("- Use job description keywords");
    doc.text("- Keep formatting simple");
    doc.text("- Include experience, education, skills sections");

    doc.end();

  } catch (error) {
    res.status(500).json({ error: "PDF generation failed" });
  }
});

/* ===================================
        START SERVER
=================================== */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
