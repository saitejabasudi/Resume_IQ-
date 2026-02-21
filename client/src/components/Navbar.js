import React from "react";
import { FaHome, FaHistory, FaLightbulb, FaUser } from "react-icons/fa";

function Navbar({ setPage, currentPage }) {

  const navItem = (icon, pageName) => (
    <button
      onClick={() => setPage(pageName)}
      className={`flex flex-col items-center transition-all duration-300 ${
        currentPage === pageName
          ? "text-yellow-400 scale-110"
          : "text-gray-400 dark:text-gray-300 hover:text-yellow-400"
      }`}
    >
      <div className="text-xl">{icon}</div>

      {/* Active Dot Indicator */}
      {currentPage === pageName && (
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1 animate-pulse"></div>
      )}
    </button>
  );

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <div className="backdrop-blur-md bg-white/70 dark:bg-black/70 px-8 py-3 rounded-full flex gap-10 shadow-2xl border border-gray-200 dark:border-gray-700">
        {navItem(<FaHome />, "home")}
        {navItem(<FaHistory />, "history")}
        {navItem(<FaLightbulb />, "tips")}
        {navItem(<FaUser />, "profile")}
      </div>
    </div>
  );
}

export default Navbar;
