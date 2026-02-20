import React from "react";
import { FaHome, FaFileAlt, FaStar, FaUser } from "react-icons/fa";

function Navbar({ setPage, currentPage }) {
  const iconStyle = (page) =>
    `cursor-pointer ${currentPage === page ? "text-yellow-400" : ""}`;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="bg-black text-white px-8 py-3 rounded-full flex gap-10 text-lg shadow-lg">
        <FaHome
          className={iconStyle("home")}
          onClick={() => setPage("home")}
        />
        <FaFileAlt
          className={iconStyle("history")}
          onClick={() => setPage("history")}
        />
        <FaStar
          className={iconStyle("tips")}
          onClick={() => setPage("tips")}
        />
        <FaUser
          className={iconStyle("profile")}
          onClick={() => setPage("profile")}
        />
      </div>
    </div>
  );
}

export default Navbar;
