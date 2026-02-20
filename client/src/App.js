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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

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
      });
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 pb-24 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 bg-black text-white px-3 py-1 rounded-lg shadow"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

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

            <div
              className={`p-6 rounded-xl shadow-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
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
                className="w-full p-2 border rounded mb-4 text-black"
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
              <div
                className={`p-6 rounded-xl shadow-md mt-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
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
