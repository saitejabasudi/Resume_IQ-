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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
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
          accept=".pdf,.doc,.docx"
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
          Analyze Resume
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
              <h3 className="font-semibold mb-2">
                Job Match: {jobMatch.matchScore}%
              </h3>

              <p className="text-green-600">
                Matched Skills:{" "}
                {jobMatch.matched?.length > 0
                  ? jobMatch.matched.join(", ")
                  : "None"}
              </p>

              <p className="text-red-500 mt-2">
                Missing Skills:{" "}
                {jobMatch.missing?.length > 0
                  ? jobMatch.missing.join(", ")
                  : "None"}
              </p>
            </div>
          )}
        </div>
      )}

      <Navbar />
    </div>
  );
}

export default App;
