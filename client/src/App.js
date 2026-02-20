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

      setJobMatch({
        matchScore: res.data.matchScore,
        matchedSkills: res.data.matchedSkills,
        missingSkills: res.data.missingSkills,
      });

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
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6">
            Ready To Level Up Your Resume?
          </h1>

          <div className="bg-white p-6 rounded-2xl shadow-md">

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
              className="w-full p-3 border rounded-lg mb-4"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={analyze}
              className="bg-yellow-400 w-full py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              AI Analysis
            </button>

            <div className="mt-4">
              <InstallButton />
            </div>

          </div>

          {loading && <Loader />}
        </div>
      )}

      {/* ================= HISTORY ================= */}
      {page === "history" && (
        <div className="p-4">

          <h2 className="text-2xl font-bold mb-4">Analysis Details</h2>

          {score !== null ? (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">

              <p className="text-green-600 font-semibold mb-4">
                ✔ Scanning Complete
              </p>

              <CircularScore score={score} />

              <h3 className="mt-6 text-xl font-bold">
                {score}/100 AI Resume Score
              </h3>

              {jobMatch && (
                <div className="mt-6 text-left">
                  <p className="text-green-600 mb-2">
                    <strong>Matched Skills:</strong>{" "}
                    {jobMatch.matchedSkills?.join(", ") || "None"}
                  </p>

                  <p className="text-red-500">
                    <strong>Missing Skills:</strong>{" "}
                    {jobMatch.missingSkills?.join(", ") || "None"}
                  </p>
                </div>
              )}

              <button
                onClick={() => setPage("home")}
                className="bg-yellow-400 mt-6 w-full py-3 rounded-xl font-semibold"
              >
                Optimize Again
              </button>

            </div>
          ) : (
            <p className="text-center mt-10">No analysis yet.</p>
          )}
        </div>
      )}

      {/* ================= TIPS ================= */}
      {page === "tips" && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Resume Tips</h2>

          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">

            <div>
              <h3 className="font-semibold">✔ Use Keywords</h3>
              <p className="text-gray-600">
                Match your resume with job description keywords.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">✔ Keep It Clean</h3>
              <p className="text-gray-600">
                Use simple fonts and proper spacing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">✔ Highlight Achievements</h3>
              <p className="text-gray-600">
                Show measurable results instead of responsibilities.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {page === "profile" && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">

            <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>

            <h3 className="text-lg font-semibold">Resume_IQ User</h3>
            <p className="text-gray-600">Free Plan</p>

          </div>
        </div>
      )}

      <Navbar setPage={setPage} currentPage={page} />

    </div>
  );
}

export default App;
