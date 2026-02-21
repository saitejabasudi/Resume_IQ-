import React from "react";

function Loader() {
  return (
    <div className="flex flex-col justify-center items-center py-10 space-y-4">
      
      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin dark:border-yellow-500"></div>

      {/* Loading Text */}
      <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
        Analyzing Resume...
      </p>

    </div>
  );
}

export default Loader;
