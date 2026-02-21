import formidable from "formidable";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractSkills(text) {
  const skillsDatabase = [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
    "python",
    "java",
    "sql",
    "aws",
    "docker",
    "git",
    "typescript",
  ];

  const lowerText = text.toLowerCase();

  return skillsDatabase.filter((skill) =>
    lowerText.includes(skill)
  );
}

function calculateATSScore(resumeText) {
  let score = 50;

  const lowerText = resumeText.toLowerCase();

  if (resumeText.length > 2000) score += 10;
  if (lowerText.includes("experience")) score += 10;
  if (lowerText.includes("projects")) score += 10;
  if (lowerText.includes("skills")) score += 10;
  if (lowerText.includes("education")) score += 10;

  return Math.min(score, 100);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const resumeFile = files.resume;
    const jobDescription = fields.jobDescription || "";

    if (!resumeFile) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const filePath = resumeFile.filepath;
    const fileType = resumeFile.mimetype;

    let resumeText = "";

    try {
      // Extract resume text
      if (fileType === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        resumeText = pdfData.text;
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          path: filePath,
        });
        resumeText = result.value;
      } else {
        return res.status(400).json({
          error: "Unsupported file type",
        });
      }

      // RULE-BASED LOGIC
      const atsScore = calculateATSScore(resumeText);

      const resumeSkills = extractSkills(resumeText);
      const jobSkills = extractSkills(jobDescription);

      const matchedSkills = resumeSkills.filter((skill) =>
        jobSkills.includes(skill)
      );

      const missingSkills = jobSkills.filter(
        (skill) => !resumeSkills.includes(skill)
      );

      const matchScore = jobSkills.length
        ? Math.round(
            (matchedSkills.length / jobSkills.length) * 100
          )
        : 0;

      // 🔥 AI ANALYSIS
      let aiAnalysis = "";

      try {
        const aiResponse =
          await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional ATS resume analyzer and career coach.",
              },
              {
                role: "user",
                content: `
Analyze this resume and compare it with the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide:
1. Overall Resume Quality Feedback
2. Key Strengths
3. Key Weaknesses
4. Specific Improvement Suggestions
`,
              },
            ],
            temperature: 0.7,
          });

        aiAnalysis =
          aiResponse.choices[0].message.content;
      } catch (aiError) {
        console.error("AI Error:", aiError);
        aiAnalysis =
          "AI analysis temporarily unavailable.";
      }

      res.status(200).json({
        atsScore,
        matchScore,
        matchedSkills,
        missingSkills,
        aiAnalysis,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Processing failed",
      });
    }
  });
}
