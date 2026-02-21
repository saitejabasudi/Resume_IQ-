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

  // Load history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    setHistory(saved);
  }, []);

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

      const res = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

    } catch (err) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">

      {/* ================= HOME ================= */}
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
              accept=".pdf,.docx"
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

          {atsScore !== null && !loading && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <div className="flex justify-center">
                <CircularScore score={atsScore} />
              </div>

              <div className="mt-4 text-center font-semibold">
                Job Match Score: {matchScore}%
              </div>

              <div className="mt-4">
                <p className="text-green-600">
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
                    AI Professional Feedback
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
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Analysis History
          </h2>

          {history.length === 0 ? (
            <p className="text-center text-gray-500">
              No analysis history yet.
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-3"
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
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Resume Improvement Tips
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Add measurable achievements (e.g., Increased sales by 30%).</li>
            <li>Use keywords from the job description.</li>
            <li>Keep formatting simple and ATS-friendly.</li>
            <li>Include relevant technical skills.</li>
            <li>Keep resume length 1–2 pages maximum.</li>
          </ul>
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {page === "profile" && (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">
            About Resume_IQ
          </h2>

          <p>
            Resume_IQ is an AI-powered resume analyzer that evaluates
            resumes, calculates ATS scores, and provides job match
            analysis with professional feedback.
          </p>
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
