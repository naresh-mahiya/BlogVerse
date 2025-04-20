import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && authentication !== authStatus) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoading(false);
  }, [authStatus, navigate, authentication]);

  return loading ? (
    <div className="min-h-[600px] flex items-center justify-center bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-200 animate-pulse">
        Loading...
      </h1>
    </div>
  ) : (
    <div className="min-h-[600px] bg-gray-900 text-gray-200 py-6 sm:px-4  lg:px-8">
      {children}
    </div>
  );
}
