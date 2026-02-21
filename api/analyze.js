import formidable from "formidable";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import OpenAI from "openai";

export const config = {
  api: { bodyParser: false },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================= SKILL DATABASE ================= */

const skillsDatabase = [
  "javascript","react","node","express","mongodb","html","css",
  "python","java","sql","aws","docker","git","typescript",
  "redux","nextjs","api","rest","graphql","firebase"
];

/* ================= IMPROVED ATS SCORING ================= */

function calculateATSScore(resumeText, jobDescription) {
  const text = resumeText.toLowerCase();
  let score = 0;

  // 1️⃣ Length Score (Max 15)
  if (resumeText.length > 1500) score += 15;
  else if (resumeText.length > 800) score += 10;
  else score += 5;

  // 2️⃣ Section Presence (Max 25)
  const sections = ["experience", "projects", "skills", "education"];
  sections.forEach(section => {
    if (text.includes(section)) score += 6;
  });

  // 3️⃣ Bullet Points (Max 10)
  const bulletCount = (resumeText.match(/•|-|\*/g) || []).length;
  if (bulletCount > 10) score += 10;
  else if (bulletCount > 5) score += 6;
  else score += 3;

  // 4️⃣ Skill Count (Max 20)
  const foundSkills = skillsDatabase.filter(skill =>
    text.includes(skill)
  );
  score += Math.min(foundSkills.length * 2, 20);

  // 5️⃣ Job Match Score Influence (Max 30)
  if (jobDescription) {
    const jd = jobDescription.toLowerCase();
    const jobSkills = skillsDatabase.filter(skill =>
      jd.includes(skill)
    );

    const matched = jobSkills.filter(skill =>
      foundSkills.includes(skill)
    );

    const matchPercent = jobSkills.length
      ? (matched.length / jobSkills.length) * 30
      : 0;

    score += matchPercent;
  }

  return Math.min(Math.round(score), 100);
}

/* ================= API HANDLER ================= */

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
      // Extract Resume Text
      if (fileType === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        resumeText = pdfData.text;
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        resumeText = result.value;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }

      /* ========= ATS ========= */

      const atsScore = calculateATSScore(resumeText, jobDescription);

      const resumeSkills = skillsDatabase.filter(skill =>
        resumeText.toLowerCase().includes(skill)
      );

      const jobSkills = skillsDatabase.filter(skill =>
        jobDescription.toLowerCase().includes(skill)
      );

      const matchedSkills = resumeSkills.filter(skill =>
        jobSkills.includes(skill)
      );

      const missingSkills = jobSkills.filter(skill =>
        !resumeSkills.includes(skill)
      );

      const matchScore = jobSkills.length
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

      /* ========= AI ANALYSIS ========= */

      let aiAnalysis = "";

      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert ATS resume analyzer and hiring consultant.",
            },
            {
              role: "user",
              content: `
Analyze this resume professionally.

Resume:
${resumeText.slice(0, 6000)}

Job Description:
${jobDescription}

Provide:
1. Overall evaluation
2. Strengths
3. Weaknesses
4. Improvement suggestions
              `,
            },
          ],
          temperature: 0.7,
        });

        aiAnalysis = aiResponse.choices[0].message.content;
      } catch (aiError) {
        aiAnalysis = "AI analysis unavailable.";
      }

      return res.status(200).json({
        atsScore,
        matchScore,
        matchedSkills,
        missingSkills,
        aiAnalysis,
      });

    } catch (error) {
      return res.status(500).json({ error: "Processing failed" });
    }
  });
}
