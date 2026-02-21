import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaHistory,
  FaLightbulb,
  FaCog,
  FaMoon,
  FaSun,
  FaFileUpload,
} from "react-icons/fa";
import CircularScore from "./components/CircularScore";
import Loader from "./components/Loader";

function App() {
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load theme on start
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
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
      <span className="capitalize">{name}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300">

      {/* ===== Sidebar ===== */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5 hidden md:flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-yellow-500 mb-6">
          Resume_IQ
        </h1>

        <SidebarButton icon={<FaHome />} name="home" />
        <SidebarButton icon={<FaHistory />} name="history" />
        <SidebarButton icon={<FaLightbulb />} name="tips" />
        <SidebarButton icon={<FaCog />} name="settings" />
      </div>

      {/* ===== Main Area ===== */}
      <div className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold capitalize">
            {page}
          </h2>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-lg text-black"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* ===== HOME ===== */}
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

        {/* ===== Other Pages Placeholder ===== */}
        {page !== "home" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <p>Content coming soon...</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
