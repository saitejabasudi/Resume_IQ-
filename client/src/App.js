import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileUpload, FaMoon, FaSun } from "react-icons/fa";
import Navbar from "./components/Navbar";
import CircularScore from "./components/CircularScore";
import Loader from "./components/Loader";
import InstallButton from "./components/InstallButton";

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // login / register

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  // ================= Load Saved User =================
  useEffect(() => {
    const savedUser = localStorage.getItem("resumeUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ================= Dark Mode =================
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

  // ================= Register =================
  const register = () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const newUser = { email, password };
    localStorage.setItem("resumeUser", JSON.stringify(newUser));
    setUser(newUser);
  };

  // ================= Login =================
  const login = () => {
    const savedUser = JSON.parse(localStorage.getItem("resumeUser"));

    if (!savedUser) {
      alert("No user found. Please register.");
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      setUser(savedUser);
    } else {
      alert("Invalid credentials");
    }
  };

  // ================= Logout =================
  const logout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // ================= Analyze =================
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
      setScore(res.data.atsScore);
      setJobMatch(res.data.jobMatch);
    } catch {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN PAGE =================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {authMode === "login" ? "Login" : "Register"}
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={authMode === "login" ? login : register}
            className="bg-yellow-400 w-full py-2 rounded-lg font-semibold"
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>

          <p
            className="text-center mt-4 text-sm cursor-pointer text-blue-500"
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          >
            {authMode === "login"
              ? "Create an account"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  // ================= MAIN APP =================
  return (
    <div className="min-h-screen p-4 pb-24 bg-gray-100 dark:bg-gray-900 dark:text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume_IQ</h1>

        <div className="flex gap-3 items-center">
          <button onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {page === "home" && (
        <>
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
              placeholder="Paste Job Description"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyze}
              className="bg-yellow-400 w-full py-2 rounded-lg font-semibold"
            >
              Start Analyzing
            </button>

            <InstallButton />
          </div>

          {loading && <Loader />}

          {score && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <CircularScore score={score} />
            </div>
          )}
        </>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
