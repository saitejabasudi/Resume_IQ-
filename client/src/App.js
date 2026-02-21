import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";
import Navbar from "./components/Navbar";
import CircularScore from "./components/CircularScore";
import Loader from "./components/Loader";
import InstallButton from "./components/InstallButton";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");

  // 🔍 Analyze Function
  const analyze = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setScore(null);
      setJobMatch(null);

      const res = await axios.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setScore(res.data.atsScore);

      setJobMatch({
        matchScore: res.data.matchScore,
        matchedSkills: res.data.matchedSkills,
        missingSkills: res.data.missingSkills,
        aiAnalysis: res.data.aiAnalysis,
      });

    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // 📄 DOWNLOAD PDF (NO INSTALL METHOD)
  const downloadReport = () => {
    if (!score) return;

    const reportContent = `
Resume_IQ - Analysis Report

ATS Score: ${score}
Job Match Score: ${jobMatch?.matchScore}%

Matched Skills:
${jobMatch?.matchedSkills?.join(", ") || "None"}

Missing Skills:
${jobMatch?.missingSkills?.join(", ") || "None"}

AI Analysis:
${jobMatch?.aiAnalysis || "Not Available"}
`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Resume Report</title>
        </head>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Resume_IQ Report</h2>
          <pre style="font-size: 15px; white-space: pre-wrap;">
${reportContent}
          </pre>
        </body>
      </html>
    `);

    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">

      {/* ================= HOME PAGE ================= */}
      {page === "home" && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Resume_IQ
          </h1>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FaFileUpload className="text-yellow-400" />
              <span className="font-semibold">Upload Resume</span>
            </div>

            <input
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              className="mb-4 w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <textarea
              placeholder="Paste Job Description (Optional)"
              className="w-full p-2 border rounded mb-4"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyze}
              className="bg-yellow-400 w-full py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Start Analyzing
            </button>

            <InstallButton />
          </div>

          {loading && <Loader />}

          {score !== null && !loading && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <CircularScore score={score} />

              {jobMatch && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-center">
                    Job Match: {jobMatch.matchScore}%
                  </h3>

                  <p className="text-green-600 mt-2">
                    <strong>Matched Skills:</strong>{" "}
                    {jobMatch.matchedSkills?.length > 0
                      ? jobMatch.matchedSkills.join(", ")
                      : "None"}
                  </p>

                  <p className="text-red-500 mt-2">
                    <strong>Missing Skills:</strong>{" "}
                    {jobMatch.missingSkills?.length > 0
                      ? jobMatch.missingSkills.join(", ")
                      : "None"}
                  </p>

                  {/* 📄 PDF DOWNLOAD BUTTON */}
                  <button
                    onClick={downloadReport}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
                  >
                    Download PDF Report
                  </button>

                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= HISTORY PAGE ================= */}
      {page === "history" && (
        <div className="text-center mt-20 text-lg">
          📄 Resume History (Coming Soon)
        </div>
      )}

      {/* ================= TIPS PAGE ================= */}
      {page === "tips" && (
        <div className="text-center mt-20 text-lg">
          ⭐ Resume Improvement Tips (Coming Soon)
        </div>
      )}

      {/* ================= PROFILE PAGE ================= */}
      {page === "profile" && (
        <div className="text-center mt-20 text-lg">
          👤 User Profile (Coming Soon)
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
