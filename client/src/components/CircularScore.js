import React, { useEffect, useState } from "react";

function CircularScore({ score = 0 }) {
  const [progress, setProgress] = useState(0);

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  /* ================= SMOOTH ANIMATION ================= */

  useEffect(() => {
    let animationFrame;
    let startTime;

    const duration = 800; // animation speed

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progressTime = timestamp - startTime;

      const percentage = Math.min(
        (progressTime / duration) * score,
        score
      );

      setProgress(Math.floor(percentage));

      if (progressTime < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [score]);

  /* ================= STROKE OFFSET ================= */

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  /* ================= SCORE COLOR ================= */

  const getColor = () => {
    if (score < 40) return "#ef4444"; // red
    if (score < 70) return "#facc15"; // yellow
    return "#22c55e"; // green
  };

  return (
    <div className="flex justify-center items-center">
      <svg height={radius * 2} width={radius * 2}>
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Animated progress */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.3s ease-out",
          }}
        />

        {/* Score text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-2xl font-bold fill-gray-800 dark:fill-white"
        >
          {progress}%
        </text>
      </svg>
    </div>
  );
}

export default CircularScore;
