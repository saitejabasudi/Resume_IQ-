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

  // ===== Load Dark Mode Preference =====
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ===== Toggle Dark Mode =====
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // ===== Analyze =====
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

  const generateTips = () => {
    if (!score) return [];

    let tips = [];

    if (score < 40) {
      tips.push("Add clear section headings.");
      tips.push("Include measurable achievements.");
    } else if (score < 70) {
      tips.push("Improve keyword matching.");
    } else {
      tips.push("Strong resume structure.");
    }

    if (jobMatch?.missing?.length > 0) {
      tips.push(
        `Add these skills if relevant: ${jobMatch.missing.join(", ")}`
      );
    }

    return tips;
  };

  return (
    <div className="min-h-screen p-4 pb-24 bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume_IQ</h1>

        <button
          onClick={toggleDarkMode}
          className="text-xl p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* ================= HOME ================= */}
      {page === "home" && (
        <>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
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
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <CircularScore score={score} />

              {jobMatch && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-center">
                    Job Match: {jobMatch.matchScore}%
                  </h3>

                  <p className="text-green-500 mt-2">
                    <strong>Matched Skills:</strong>{" "}
                    {jobMatch.matched?.length > 0
                      ? jobMatch.matched.join(", ")
                      : "None"}
                  </p>

                  <p className="text-red-400 mt-2">
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

      {/* ================= TIPS ================= */}
      {page === "tips" && (
        <div>
          <h2 className="text-xl font-bold text-center mb-6">
            Smart Resume Tips
          </h2>

          {score === null ? (
            <p className="text-center text-gray-400">
              Analyze resume first.
            </p>
          ) : (
            generateTips().map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4"
              >
                {tip}
              </div>
            ))
          )}
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
