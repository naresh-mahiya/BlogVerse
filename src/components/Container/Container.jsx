import React from "react";

const Container = ({ children, className = "", padding = "py-6" }) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto p-2 sm:px-4 lg:px-8 ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
