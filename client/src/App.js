import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";
import Navbar from "./components/Navbar";
import CircularScore from "./components/CircularScore";
import Loader from "./components/Loader";
import InstallButton from "./components/InstallButton";

function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return alert("Upload resume first");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setScore(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/analyze",
        formData
      );

      setScore(res.data.atsScore);
      setFeedback(res.data.feedback);
    } catch (err) {
      alert("Analysis failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Resume_IQ</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <FaFileUpload className="text-yellow-400" />
          <span className="font-semibold">Upload Resume</span>
        </div>

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={analyze}
          className="bg-yellow-400 w-full py-2 rounded-lg font-semibold"
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

          <div className="mt-6 text-sm whitespace-pre-wrap">
            {feedback}
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}

export default App;
