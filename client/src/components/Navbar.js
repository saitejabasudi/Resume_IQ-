import React from "react";
import { FaHome, FaHistory, FaLightbulb, FaUser } from "react-icons/fa";

function Navbar({ setPage, currentPage }) {
  const navItem = (icon, pageName) => (
    <button
      onClick={() => setPage(pageName)}
      className={`text-xl ${
        currentPage === pageName
          ? "text-yellow-400"
          : "text-white"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="bg-black px-8 py-3 rounded-full flex gap-10 shadow-lg">
        {navItem(<FaHome />, "home")}
        {navItem(<FaHistory />, "history")}
        {navItem(<FaLightbulb />, "tips")}
        {navItem(<FaUser />, "profile")}
      </div>
    </div>
  );
}

export default Navbar;
