import React, { useState } from "react";
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
      setAtsScore(null);
      setMatchScore(null);
      setMatchedSkills([]);
      setMissingSkills([]);
      setAiAnalysis("");

      const res = await axios.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAtsScore(res.data.atsScore);
      setMatchScore(res.data.matchScore);
      setMatchedSkills(res.data.matchedSkills);
      setMissingSkills(res.data.missingSkills);
      setAiAnalysis(res.data.aiAnalysis);

    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">

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

          {/* RESULTS SECTION */}
          {atsScore !== null && !loading && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">

              <h2 className="text-center font-semibold mb-4">
                ATS Resume Score
              </h2>

              <div className="flex justify-center">
                <CircularScore score={atsScore} />
              </div>

              <div className="mt-6 text-center">
                <h3 className="font-semibold">
                  Job Match Score: {matchScore}%
                </h3>
              </div>

              <div className="mt-6">
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
            </div>
          )}

          {/* AI ANALYSIS */}
          {aiAnalysis && !loading && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6 whitespace-pre-wrap">
              <h2 className="font-semibold mb-4 text-center">
                AI Professional Feedback
              </h2>
              {aiAnalysis}
            </div>
          )}
        </>
      )}

      <Navbar setPage={setPage} currentPage={page} />
    </div>
  );
}

export default App;
