import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import "../styles/forms.css";

// Validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [error, setError] = useState("");

  // Memoize form configuration to prevent re-renders
  const formConfig = useMemo(() => ({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  }), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm(formConfig);

  // Memoize form submission handler
  const onSubmit = useCallback(async (data) => {
    try {
      setError("");
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  }, [registerUser, navigate]);

  return (
    <div className="auth-background">
      <div className="form-container">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="form-header">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Start your habit tracking journey today</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-field">
              <label className="form-label">Username</label>
              <input
                {...register("username")}
                type="text"
                className="form-input"
                placeholder="Enter your username"
                disabled={loading || isSubmitting}
              />
              {errors.username && (
                <span className="form-error">{errors.username.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="form-input"
                placeholder="Enter your email"
                disabled={loading || isSubmitting}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                {...register("password")}
                type="password"
                className="form-input"
                placeholder="Enter your password"
                disabled={loading || isSubmitting}
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="form-input"
                placeholder="Confirm your password"
                disabled={loading || isSubmitting}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="form-button w-full flex items-center justify-center"
            >
              {(loading || isSubmitting) ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="form-footer">
            <p className="form-footer-text">
              Already have an account?{" "}
              <Link to="/login" className="form-footer-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
