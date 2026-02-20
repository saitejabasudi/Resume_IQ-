import formidable from "formidable";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form error:", err);
      return res.status(500).json({ error: "File parsing failed" });
    }

    try {
      const file = files.resume;
      const jobDescription = fields.jobDescription || "";

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let resumeText = "";
      const fileName = file.originalFilename.toLowerCase();

      // ===== PDF =====
      if (fileName.endsWith(".pdf")) {
        const dataBuffer = fs.readFileSync(file.filepath);
        const data = await pdfParse(dataBuffer);
        resumeText = data.text;
      }

      // ===== DOCX =====
      else if (fileName.endsWith(".docx")) {
        const result = await mammoth.extractRawText({
          path: file.filepath,
        });
        resumeText = result.value;
      }

      // ===== IMAGE (JPG / PNG) =====
      else if (
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png")
      ) {
        const {
          data: { text },
        } = await Tesseract.recognize(file.filepath, "eng");

        resumeText = text;
      }

      else {
        return res.status(400).json({ error: "Unsupported file type" });
      }

      if (!resumeText || resumeText.length < 20) {
        return res.status(400).json({ error: "Could not extract text from file" });
      }

      // ===== Simple Matching Logic =====
      const resumeWords = resumeText.toLowerCase().split(/\W+/);
      const jobWords = jobDescription.toLowerCase().split(/\W+/);

      const matchedSkills = jobWords.filter(word =>
        resumeWords.includes(word)
      );

      const uniqueMatched = [...new Set(matchedSkills)];

      const matchScore = jobWords.length
        ? Math.round((uniqueMatched.length / jobWords.length) * 100)
        : 0;

      const atsScore = Math.min(100, Math.round(resumeText.length / 50));

      const missingSkills = jobWords.filter(
        word => !resumeWords.includes(word)
      );

      res.status(200).json({
        atsScore,
        matchScore,
        matchedSkills: uniqueMatched.slice(0, 10),
        missingSkills: [...new Set(missingSkills)].slice(0, 10),
      });

    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Analysis failed" });
    }
  });
}
