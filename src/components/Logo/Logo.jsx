import React from "react";

const Logo = ({ width = "50px" }) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <img
        src="/logo3.jpg"
        alt="Logo"
        style={{ width: width }}
        className="object-fill rounded-xl"
      />
      <div className="flex items-center">
        <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Blog
        </span>
        <span className="text-3xl font-bold text-white ml-1">Vibe</span>
      </div>
    </div>
  );
};

export default Logo;
