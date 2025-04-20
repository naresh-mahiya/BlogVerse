import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <button
      onClick={logoutHandler}
      aria-label="Logout"
      className="inline-block px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none transition duration-300 ease-in-out"
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
