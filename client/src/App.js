import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle File Upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Allow only PDF & DOCX
    if (
      !selectedFile.name.toLowerCase().endsWith(".pdf") &&
      !selectedFile.name.toLowerCase().endsWith(".docx")
    ) {
      alert("Only PDF and DOCX files are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  // Analyze Resume
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume first.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Resume analysis failed. Please upload a valid PDF or DOCX file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Resume_IQ</h1>

      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg">
        {/* Upload Section */}
        <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="mb-4"
        />

        {/* Job Description */}
        <textarea
          placeholder="Paste Job Description (Optional)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          rows="5"
        />

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Results Section */}
        {result && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Analysis Result</h3>

            <p className="mb-2">
              <strong>ATS Score:</strong> {result.atsScore}%
            </p>

            <p className="mb-2">
              <strong>Job Match Score:</strong> {result.matchScore}%
            </p>

            <div className="mb-2">
              <strong>Matched Skills:</strong>
              <ul className="list-disc list-inside">
                {result.matchedSkills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Missing Skills:</strong>
              <ul className="list-disc list-inside">
                {result.missingSkills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
