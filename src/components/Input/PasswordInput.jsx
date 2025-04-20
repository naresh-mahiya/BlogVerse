import { forwardRef, useState } from "react";
import { Input } from "../index";

const PasswordInput = ({ label, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        type={showPassword ? "text" : "password"}
        {...props}
        error={error}
        ref={ref}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className={`absolute top-1/2 ${
          error ? "-translate-y-3" : "-translate-y-0.5"
        } right-3 text-xl text-gray-400 hover:text-gray-200 focus:outline-none `}
      >
        {showPassword ? "🔓" : "🔒"}
      </button>
    </div>
  );
};

export default forwardRef(PasswordInput);
