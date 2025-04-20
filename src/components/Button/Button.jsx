import React from "react";

const Button = ({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-gray-100",
  hoverColor = "hover:bg-gray-600",
  activeColor = "active:bg-gray-800",
  className = "",
  ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={`px-5 py-2.5 text-sm font-medium rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${bgColor} ${textColor} ${hoverColor} ${activeColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
