const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();
const PORT = 5000;

/* ===================================
        ATS ANALYSIS ENGINE
=================================== */

function analyzeResume(text) {
  let score = 0;
  let feedback = "";

  const lowerText = text.toLowerCase();

  /* =====================
      SECTION CHECK
  ====================== */

  const sections = ["experience", "education", "skills", "projects"];
  let sectionScore = 0;

  sections.forEach(section => {
    if (lowerText.includes(section)) {
      sectionScore += 10;
    }
  });

  score += sectionScore;

  /* =====================
      KEYWORD CHECK
  ====================== */

  const keywords = [
    "leadership",
    "managed",
    "developed",
    "team",
    "python",
    "java",
    "javascript",
    "react",
    "node",
    "analysis",
    "data",
    "communication",
    "problem solving"
  ];

  let keywordMatches = 0;

  keywords.forEach(word => {
    if (lowerText.includes(word)) {
      keywordMatches++;
      score += 3;
    }
  });

  /* =====================
      LENGTH CHECK
  ====================== */

  if (text.length > 1000) {
    score += 15;
  } else {
    feedback += "• Resume content is too short. Add more detailed experience.\n";
  }

  /* =====================
      NUMBERS CHECK
  ====================== */

  if (text.match(/\d+/)) {
    score += 10;
  } else {
    feedback += "• Add measurable achievements (numbers, % increase, etc).\n";
  }

  /* =====================
      EMAIL CHECK
  ====================== */

  if (text.match(/@[a-zA-Z0-9.-]+/)) {
    score += 5;
  } else {
    feedback += "• Add professional email address.\n";
  }

  /* =====================
      FINAL SCORE LIMIT
  ====================== */

  score = Math.min(score, 100);

  /* =====================
      FEEDBACK GENERATION
  ====================== */

  feedback =
    "Resume Analysis Report:\n\n" +
    `✔ Sections Score: ${sectionScore}/40\n` +
    `✔ Keywords Found: ${keywordMatches}\n` +
    `✔ Overall ATS Score: ${score}/100\n\n` +
    "Improvement Suggestions:\n" +
    feedback +
    "\n• Use bullet points.\n• Avoid images & graphics.\n• Use standard headings.\n• Keep formatting simple.\n";

  return { score, feedback };
}

/* ===================================
        HEALTH CHECK
=================================== */

app.get("/", (req, res) => {
  res.send("Resume IQ Free ATS Backend Running 🚀");
});

/* ===================================
        ANALYZE API
=================================== */

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

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

    const result = analyzeResume(text);

    res.json({
      success: true,
      atsScore: result.score,
      feedback: result.feedback,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Resume analysis failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
