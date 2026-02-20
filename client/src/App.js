import React, { useState } from "react";
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

      setPage("history");
    } catch (err) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-28">

      {/* ================= HOME ================= */}
      {page === "home" && (
        <div className="p-6">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Resume <span className="text-yellow-400">IQ</span>
            </h1>
            <p className="text-gray-500 mt-2">
              AI Powered Resume Optimization
            </p>
          </div>

          {/* Main Card */}
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
              className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyze}
              className="bg-yellow-400 w-full py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-500 transition"
            >
              Start AI Analysis
            </button>

            <div className="mt-4">
              <InstallButton />
            </div>

          </div>

          {loading && <Loader />}
        </div>
      )}

      {/* ================= RESULT ================= */}
      {page === "history" && (
        <div className="p-6">

          <h2 className="text-2xl font-bold mb-6">Analysis Result</h2>

          {score !== null ? (
            <div className="bg-white rounded-3xl shadow-lg p-6 text-center">

              <div className="bg-green-100 text-green-600 py-2 rounded-xl text-sm mb-6">
                ✔ Scanning Completed Successfully
              </div>

              <CircularScore score={score} />

              <h3 className="mt-6 text-2xl font-bold">
                {score}/100 Resume Score
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
                className="bg-yellow-400 mt-8 w-full py-3 rounded-xl font-semibold shadow-md"
              >
                Analyze Another Resume
              </button>

            </div>
          ) : (
            <p className="text-center mt-20 text-gray-500">
              No analysis yet.
            </p>
          )}
        </div>
      )}

      {/* ================= TIPS ================= */}
      {page === "tips" && (
        <div className="p-6">
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
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {page === "profile" && (
        <div className="p-6 text-center">
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-lg">Resume_IQ User</h3>
            <p className="text-gray-500 text-sm mt-1">Free Plan</p>
          </div>
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
