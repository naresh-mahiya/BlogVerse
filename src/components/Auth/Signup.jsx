import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../../store/slices/authSlice";
import { Button, Logo, Input, PasswordInput } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loading, error } = useSelector((state) => state.auth);
  const checkActiveSession = async () => {
    try {
      const user = await authService.getCurrentUser();
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

  const signup = async (data) => {
    try {
      const response = await dispatch(registerUser(data));
      if (response?.meta?.requestStatus === "fulfilled") navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <span className="inline-block w-20 mx-auto">
            <Logo />
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-100 text-center">
          Create your account
        </h2>
        <p className="mt-4 text-gray-400 text-center">
          Already have an account?&nbsp;
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
        {error && (
          <p className="mt-4 text-center text-lg text-red-500">{error}</p>
        )}
        <form onSubmit={handleSubmit(signup)} className="mt-6">
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...register("name", { required: "Name is required" })}
              error={errors.name?.message}
            />
            <Input
              label="Email"
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
              } text-gray-100`}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
