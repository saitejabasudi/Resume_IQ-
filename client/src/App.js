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

  // ================= ANALYZE FUNCTION =================
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      setScore(res.data.atsScore);
      setJobMatch(res.data.jobMatch);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SMART TIPS =================
  const generateTips = () => {
    if (!score) return [];

    let tips = [];

    if (score < 40) {
      tips.push("Add clear section headings like Experience, Education, Skills.");
      tips.push("Increase resume length with detailed responsibilities.");
      tips.push("Use numbers to show impact (e.g., Increased sales by 20%).");
    }

    if (score >= 40 && score < 70) {
      tips.push("Improve keyword matching with job description.");
      tips.push("Add measurable achievements.");
    }

    if (score >= 70) {
      tips.push("Resume structure is strong.");
      tips.push("Optimize formatting for better readability.");
    }

    if (jobMatch?.missing?.length > 0) {
      tips.push(
        `Consider adding these skills if relevant: ${jobMatch.missing.join(", ")}`
      );
    }

    return tips;
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
                    {jobMatch.matched?.length > 0
                      ? jobMatch.matched.join(", ")
                      : "None"}
                  </p>

                  <p className="text-red-500 mt-2">
                    <strong>Missing Skills:</strong>{" "}
                    {jobMatch.missing?.length > 0
                      ? jobMatch.missing.join(", ")
                      : "None"}
                  </p>
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
        <div>
          <h2 className="text-xl font-bold text-center mb-6">
            Smart Resume Tips
          </h2>

          {score === null ? (
            <p className="text-center text-gray-500">
              Analyze your resume first to see tips.
            </p>
          ) : (
            <div className="space-y-4">
              {generateTips().map((tip, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400"
                >
                  {tip}
                </div>
              ))}
            </div>
          )}
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
