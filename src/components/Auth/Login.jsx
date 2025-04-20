import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin, logout } from "../../store/slices/authSlice";
import { Button, Input, Logo, PasswordInput } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const checkActiveSession = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log("Active session detected:", user);
      if (user) return true; // User is already logged in
    } catch (err) {
      return false; // No active session
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const hasActiveSession = await checkActiveSession();
      if (hasActiveSession) {
        await dispatch(logout());
      }
    };
    checkSession();
  }, [dispatch]);

  const { loading, error } = useSelector((state) => state.auth);

  const login = async (data) => {
    try {
      const response = await dispatch(authLogin(data));
      if (response.meta.requestStatus === "fulfilled") navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex px-2 items-center justify-center min-h-[600px] bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <span className="inline-block w-16 sm:w-20 mx-auto">
            <Logo />
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 text-center">
          Sign in to your account
        </h2>
        <p className="mt-4 text-gray-400 text-center text-sm sm:text-base">
          Don&apos;t have an account?&nbsp;
          <Link to="/signup" className="text-blue-400 hover:underline">
            Signup
          </Link>
        </p>
        {error && (
          <p className="mt-4 text-center text-sm sm:text-lg text-red-500">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit(login)} className="mt-6">
          <div className="space-y-4">
            <Input
              label="Email"
              autoComplete="email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email is invalid",
                },
              })}
              error={errors.email?.message}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
              error={errors.password?.message}
            />
            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
              } text-gray-100 py-2`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
