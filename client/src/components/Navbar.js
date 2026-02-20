import React from "react";
import { FaHome, FaFileAlt, FaStar, FaUser } from "react-icons/fa";

function Navbar({ setPage, currentPage }) {
  const activeStyle = "text-yellow-400";
  const normalStyle = "text-gray-400";

  return (
    <div className="fixed bottom-5 left-0 right-0 flex justify-center">
      <div className="bg-black w-80 py-3 rounded-full flex justify-around items-center shadow-lg">

        <button onClick={() => setPage("home")}>
          <FaHome
            size={20}
            className={currentPage === "home" ? activeStyle : normalStyle}
          />
        </button>

        <button onClick={() => setPage("history")}>
          <FaFileAlt
            size={20}
            className={currentPage === "history" ? activeStyle : normalStyle}
          />
        </button>

        <button onClick={() => setPage("tips")}>
          <FaStar
            size={20}
            className={currentPage === "tips" ? activeStyle : normalStyle}
          />
        </button>

        <button onClick={() => setPage("profile")}>
          <FaUser
            size={20}
            className={currentPage === "profile" ? activeStyle : normalStyle}
          />
        </button>

      </div>
    </div>
  );
}

export default Navbar;
