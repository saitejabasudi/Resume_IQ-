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

  // ✅ HISTORY STATE (Auto Load from localStorage)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("resumeHistory");
    return saved ? JSON.parse(saved) : [];
  });

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
      setJobMatch(res.data.jobMatch);

      // ✅ SAVE TO HISTORY
      const newEntry = {
        date: new Date().toLocaleString(),
        score: res.data.atsScore,
        match: res.data.jobMatch?.matchScore || 0
      };

      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));

      setPage("result");

    } catch (err) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-28">

      <AnimatePresence mode="wait">

        {/* ================= HOME PAGE ================= */}
        {page === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <h1 className="text-3xl font-bold mb-2">
              Resume <span className="text-yellow-400">IQ</span>
            </h1>
            <p className="text-gray-500 mb-6">
              AI Powered Resume Optimization
            </p>

            <div className="bg-white p-6 rounded-3xl shadow-lg">
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
                className="w-full p-3 border rounded-xl mb-4"
                rows="4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <button
                onClick={analyze}
                className="bg-yellow-400 w-full py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
              >
                Start AI Analysis
              </button>

              <div className="mt-4">
                <InstallButton />
              </div>
            </div>

            {loading && <Loader />}
          </motion.div>
        )}

        {/* ================= RESULT PAGE ================= */}
        {page === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Analysis Result</h2>

            <div className="bg-white p-6 rounded-3xl shadow-lg text-center">

              <CircularScore score={score} />

              <h3 className="mt-6 text-xl font-semibold">
                Resume Score: {score}/100
              </h3>

              {jobMatch && (
                <div className="mt-6 text-left space-y-4">

                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-green-700 font-semibold">
                      Matched Skills
                    </p>
                    <p className="text-sm mt-1">
                      {jobMatch.matched?.join(", ") || "None"}
                    </p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-red-600 font-semibold">
                      Missing Skills
                    </p>
                    <p className="text-sm mt-1">
                      {jobMatch.missing?.join(", ") || "None"}
                    </p>
                  </div>

                </div>
              )}

              <button
                onClick={() => setPage("home")}
                className="bg-yellow-400 mt-8 w-full py-3 rounded-xl font-semibold"
              >
                Analyze Another Resume
              </button>
            </div>
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
            className="p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Resume History</h2>

            {history.length === 0 ? (
              <p className="text-gray-500 text-center">
                No past analysis yet.
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-2xl shadow-md"
                  >
                    <p className="text-sm text-gray-500">{item.date}</p>
                    <p className="font-semibold mt-1">
                      Resume Score: {item.score}/100
                    </p>
                    <p className="text-sm text-gray-600">
                      Job Match: {item.match}%
                    </p>
                  </div>
                ))}
              </div>
            )}
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
            className="p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Resume Tips</h2>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-md">
                <h3 className="font-semibold">Use Keywords</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Match resume content with job description keywords.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-md">
                <h3 className="font-semibold">Add Achievements</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Use measurable results instead of generic tasks.
                </p>
              </div>
            </div>
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
            className="p-6 text-center"
          >
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg">Resume_IQ User</h3>
              <p className="text-gray-500 text-sm mt-1">Free Plan</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
