import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileUpload, FaMoon, FaSun } from "react-icons/fa";
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
  const [darkMode, setDarkMode] = useState(false);

  /* ================= DARK MODE ================= */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /* ================= ANALYZE ================= */

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

      const res = await axios.post("/api/analyze", formData);

      setScore(res.data.atsScore);

      setJobMatch({
        matchScore: res.data.matchScore,
        matchedSkills: res.data.matchedSkills,
        missingSkills: res.data.missingSkills,
        aiAnalysis: res.data.aiAnalysis,
      });

    } catch (err) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PDF EXPORT ================= */

  const downloadReport = () => {
    if (!score) return;

    const content = `
Resume IQ - Analysis Report

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
        <head><title>Resume Report</title></head>
        <body style="font-family:Arial;padding:30px">
          <h2>Resume IQ Report</h2>
          <pre style="white-space:pre-wrap;font-size:15px">${content}</pre>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="min-h-screen transition-all duration-300 
      bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 pb-28">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume IQ</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl p-2 rounded-full bg-white dark:bg-gray-800 shadow"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* ================= HOME ================= */}

      {page === "home" && (
        <>
          <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 
            p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">

            <div className="flex items-center gap-2 mb-4">
              <FaFileUpload className="text-yellow-400" />
              <span className="font-semibold">Upload Resume</span>
            </div>

            <input
              type="file"
              accept=".pdf,.docx"
              className="mb-4 w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <textarea
              placeholder="Paste Job Description (Optional)"
              className="w-full p-3 rounded-lg border dark:bg-gray-700 mb-4"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyze}
              className="bg-yellow-400 w-full py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              Start Analyzing
            </button>

            <InstallButton />
          </div>

          {loading && <Loader />}

          {score !== null && !loading && (
            <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 
              p-6 rounded-2xl shadow-xl mt-6 border border-gray-200 dark:border-gray-700">

              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <CircularScore score={score} />

              {jobMatch && (
                <div className="mt-6">

                  <h3 className="font-semibold text-center mb-3">
                    Job Match: {jobMatch.matchScore}%
                  </h3>

                  <p className="text-green-500">
                    <strong>Matched Skills:</strong>{" "}
                    {jobMatch.matchedSkills?.join(", ") || "None"}
                  </p>

                  <p className="text-red-500 mt-2">
                    <strong>Missing Skills:</strong>{" "}
                    {jobMatch.missingSkills?.join(", ") || "None"}
                  </p>

                  {jobMatch.aiAnalysis && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm whitespace-pre-wrap">
                      {jobMatch.aiAnalysis}
                    </div>
                  )}

                  <button
                    onClick={downloadReport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl mt-4 w-full"
                  >
                    Download PDF Report
                  </button>

                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= OTHER PAGES ================= */}

      {page === "history" && (
        <div className="text-center mt-20 text-lg">
          Resume History (Coming Soon)
        </div>
      )}

      {page === "tips" && (
        <div className="text-center mt-20 text-lg">
          Resume Improvement Tips (Coming Soon)
        </div>
      )}

      {page === "profile" && (
        <div className="text-center mt-20 text-lg">
          User Profile (Coming Soon)
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
