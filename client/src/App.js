import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import InstallButton from "./components/InstallButton";
import CircularScore from "./components/CircularScore";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load history
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    setHistory(saved);
  }, []);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

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

  const clearHistory = () => {
    localStorage.removeItem("resumeHistory");
    setHistory([]);
  };

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

      const res = await axios.post("/api/analyze", formData);

      setAtsScore(res.data.atsScore);
      setMatchScore(res.data.matchScore);
      setMatchedSkills(res.data.matchedSkills);
      setMissingSkills(res.data.missingSkills);
      setAiAnalysis(res.data.aiAnalysis);

      const newEntry = {
        date: new Date().toLocaleString(),
        atsScore: res.data.atsScore,
        matchScore: res.data.matchScore,
      };

      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));

    } catch {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24 bg-gray-100 dark:bg-gray-900 dark:text-white transition">

      {/* ================= HOME ================= */}
      {page === "home" && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Resume_IQ
          </h1>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
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
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
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

          {atsScore !== null && !loading && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
              <div className="flex justify-center">
                <CircularScore score={atsScore} />
              </div>

              <div className="mt-4 text-center font-semibold">
                Job Match Score: {matchScore}%
              </div>

              <div className="mt-4">
                <p className="text-green-500">
                  <strong>Matched Skills:</strong>{" "}
                  {matchedSkills.length > 0
                    ? matchedSkills.join(", ")
                    : "None"}
                </p>

                <p className="text-red-500 mt-2">
                  <strong>Missing Skills:</strong>{" "}
                  {missingSkills.length > 0
                    ? missingSkills.join(", ")
                    : "None"}
                </p>
              </div>

              {aiAnalysis && (
                <div className="mt-6 whitespace-pre-wrap">
                  <h3 className="font-semibold mb-2">
                    AI Feedback
                  </h3>
                  {aiAnalysis}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= HISTORY ================= */}
      {page === "history" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Analysis History
          </h2>

          {history.length === 0 ? (
            <p className="text-center text-gray-500">
              No history yet.
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-3 dark:border-gray-600"
              >
                <p><strong>Date:</strong> {item.date}</p>
                <p><strong>ATS Score:</strong> {item.atsScore}</p>
                <p><strong>Match Score:</strong> {item.matchScore}%</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TIPS ================= */}
      {page === "tips" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Resume Tips
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Add measurable achievements.</li>
            <li>Use job description keywords.</li>
            <li>Keep resume ATS-friendly.</li>
            <li>Highlight relevant skills.</li>
            <li>Keep it clean and professional.</li>
          </ul>
        </div>
      )}

      {/* ================= SETTINGS ================= */}
      {page === "profile" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-center">
            Settings
          </h2>

          <div className="flex justify-between items-center mb-6">
            <span>Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className="bg-yellow-400 px-4 py-1 rounded-lg"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <button
            onClick={clearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Clear Analysis History
          </button>
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
