import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaHistory,
  FaLightbulb,
  FaCog,
  FaFileUpload,
} from "react-icons/fa";
import CircularScore from "./components/CircularScore";
import Loader from "./components/Loader";

function App() {
  const [page, setPage] = useState("home");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    setHistory(saved);

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

  const SidebarButton = ({ icon, name }) => (
    <button
      onClick={() => setPage(name)}
      className={`flex items-center gap-3 p-3 rounded-lg transition ${
        page === name
          ? "bg-yellow-400 text-black"
          : "hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span className="font-medium capitalize">{name}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition">

      {/* ============ SIDEBAR ============ */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5 hidden md:flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-yellow-500 mb-6">
          Resume_IQ
        </h1>

        <SidebarButton icon={<FaHome />} name="home" />
        <SidebarButton icon={<FaHistory />} name="history" />
        <SidebarButton icon={<FaLightbulb />} name="tips" />
        <SidebarButton icon={<FaCog />} name="settings" />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold capitalize">
            {page}
          </h2>

          <button
            onClick={toggleDarkMode}
            className="bg-yellow-400 px-4 py-2 rounded-lg"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* ================= HOME ================= */}
        {page === "home" && (
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

            {loading && <Loader />}

            {atsScore && (
              <div className="mt-6 text-center">
                <CircularScore score={atsScore} />
                <p className="mt-3 font-semibold">
                  Match Score: {matchScore}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= HISTORY ================= */}
        {page === "history" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            {history.length === 0 ? (
              <p>No analysis history yet.</p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg mb-3 dark:border-gray-600"
                >
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>ATS:</strong> {item.atsScore}</p>
                  <p><strong>Match:</strong> {item.matchScore}%</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= TIPS ================= */}
        {page === "tips" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <ul className="list-disc pl-6 space-y-2">
              <li>Add measurable achievements.</li>
              <li>Use job description keywords.</li>
              <li>Keep resume ATS-friendly.</li>
              <li>Highlight relevant skills.</li>
              <li>Keep resume clean and concise.</li>
            </ul>
          </div>
        )}

        {/* ================= SETTINGS ================= */}
        {page === "settings" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <button
              onClick={() => {
                localStorage.removeItem("resumeHistory");
                setHistory([]);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Clear History
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
