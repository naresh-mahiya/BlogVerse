import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="text-white font-semibold">
          {userData?.name?.charAt(0)?.toUpperCase() || "U"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm text-white font-medium">{userData?.name}</p>
              <p className="text-xs text-gray-400">{userData?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 