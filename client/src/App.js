import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload, FaChartBar } from "react-icons/fa";
import Navbar from "./components/Navbar";

function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");

  const analyze = async () => {
    if (!file) return alert("Upload resume first");

    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://localhost:5000/analyze",
      formData
    );

    setScore(res.data.atsScore);
    setFeedback(res.data.feedback);
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
      </div>

      {score !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-green-500" />
            <span className="font-semibold">ATS Score</span>
          </div>

          <h2 className="text-4xl font-bold text-center mb-4">
            {score}/100
          </h2>

          <div className="text-sm whitespace-pre-wrap">
            {feedback}
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}

export default App;
