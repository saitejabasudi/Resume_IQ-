import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
