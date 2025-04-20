import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", error, className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full mb-4">
      {label && (
        <label
          className="block text-sm font-medium text-gray-300 mb-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        aria-invalid={!!error}
        className={`px-4 py-2 bg-gray-700 text-gray-200 placeholder-gray-400 border ${
          error ? "border-red-500" : "border-gray-600"
        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
