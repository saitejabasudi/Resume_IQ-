import React, { useState, useEffect } from "react";
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
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("resumeHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
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
      setScore(null);
      setJobMatch(null);

      const res = await axios.post("/api/analyze", formData);

      const resultData = {
        date: new Date().toLocaleString(),
        atsScore: res.data.atsScore,
        matchScore: res.data.matchScore,
        matchedSkills: res.data.matchedSkills,
        missingSkills: res.data.missingSkills,
      };

      setScore(res.data.atsScore);
      setJobMatch({
        matchScore: res.data.matchScore,
        matchedSkills: res.data.matchedSkills,
        missingSkills: res.data.missingSkills,
      });

      // Save to history
      const updatedHistory = [resultData, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(
        "resumeHistory",
        JSON.stringify(updatedHistory)
      );

    } catch (err) {
      console.error(err);
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

          {score !== null && !loading && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <CircularScore score={score} />

              {jobMatch && (
                <div className="mt-6">
                  <h3 className="font-semibold text-center mb-2">
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
        </>
      )}

      {/* ================= HISTORY ================= */}
      {page === "history" && (
        <div>
          <h2 className="text-xl font-bold text-center mb-6">
            Resume Analysis History
          </h2>

          {history.length === 0 ? (
            <p className="text-center text-gray-500">
              No history yet.
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow mb-4"
              >
                <p className="text-sm text-gray-500 mb-2">
                  {item.date}
                </p>

                <p><strong>ATS Score:</strong> {item.atsScore}</p>
                <p><strong>Job Match:</strong> {item.matchScore}%</p>

                <p className="text-green-600 text-sm mt-2">
                  Matched: {item.matchedSkills.join(", ") || "None"}
                </p>

                <p className="text-red-500 text-sm">
                  Missing: {item.missingSkills.join(", ") || "None"}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TIPS ================= */}
      {page === "tips" && (
        <div className="text-center mt-20 text-lg">
          ⭐ Resume Improvement Tips (Next Step)
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {page === "profile" && (
        <div className="text-center mt-20 text-lg">
          👤 User Profile (Next Step)
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
