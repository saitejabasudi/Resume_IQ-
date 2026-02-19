import React from "react";
import { FaHome, FaFileAlt, FaStar, FaUser } from "react-icons/fa";

function Navbar() {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="bg-black text-white px-8 py-3 rounded-full flex gap-10 text-lg shadow-lg">
        <FaHome />
        <FaFileAlt />
        <FaStar />
        <FaUser />
      </div>
    </div>
  );
}

export default Navbar;
