import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import CircularScore from "./components/CircularScore";
import Loader from "./components/Loader";
import InstallButton from "./components/InstallButton";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");

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
      setSuggestions([]);

      const res = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setScore(res.data.atsScore);

      setJobMatch({
        matchScore: res.data.matchScore,
        matchedSkills: res.data.matchedSkills,
        missingSkills: res.data.missingSkills,
      });

      // ✅ Smart Suggestions Logic
      const generatedSuggestions = [];

      if (res.data.atsScore < 60) {
        generatedSuggestions.push(
          "Improve resume formatting and use clear section headings."
        );
      }

      if (res.data.missingSkills?.length > 0) {
        generatedSuggestions.push(
          `Add missing skills such as: ${res.data.missingSkills.join(", ")}`
        );
      }

      if (!jobDescription) {
        generatedSuggestions.push(
          "Paste a job description to get a more accurate job match score."
        );
      }

      if (res.data.atsScore >= 75) {
        generatedSuggestions.push(
          "Great resume! Consider tailoring it more specifically to each job role."
        );
      }

      setSuggestions(generatedSuggestions);

    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">

      <AnimatePresence mode="wait">

        {/* ================= HOME PAGE ================= */}
        {page === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6 text-center">
              Resume_IQ
            </h1>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
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
                className="w-full p-3 border rounded-lg mb-4"
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

            {/* ================= RESULT SECTION ================= */}
            {score !== null && !loading && (
              <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
                <h2 className="text-center font-semibold mb-4">
                  ATS Resume Score
                </h2>

                <CircularScore score={score} />

                {jobMatch && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-center">
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
                  </div>
                )}

                {/* ✅ AI Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-6 bg-blue-50 p-5 rounded-2xl">
                    <h3 className="font-semibold text-blue-700 mb-3">
                      AI Improvement Suggestions
                    </h3>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      {suggestions.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ================= HISTORY PAGE ================= */}
        {page === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-20 text-lg"
          >
            📄 Resume History (Coming Soon)
          </motion.div>
        )}

        {/* ================= TIPS PAGE ================= */}
        {page === "tips" && (
          <motion.div
            key="tips"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-20 text-lg"
          >
            ⭐ Resume Improvement Tips (Coming Soon)
          </motion.div>
        )}

        {/* ================= PROFILE PAGE ================= */}
        {page === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-20 text-lg"
          >
            👤 User Profile (Coming Soon)
          </motion.div>
        )}

      </AnimatePresence>

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
