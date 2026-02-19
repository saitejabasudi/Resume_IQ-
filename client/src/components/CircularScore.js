import React, { useEffect, useState } from "react";

function CircularScore({ score }) {
  const [progress, setProgress] = useState(0);

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= score) {
        clearInterval(interval);
      }
      setProgress(start);
    }, 15);
  }, [score]);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (score < 40) return "#ef4444"; // red
    if (score < 70) return "#facc15"; // yellow
    return "#22c55e"; // green
  };

  return (
    <div className="flex justify-center items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-2xl font-bold fill-gray-800"
        >
          {progress}
        </text>
      </svg>
    </div>
  );
}

export default CircularScore;
