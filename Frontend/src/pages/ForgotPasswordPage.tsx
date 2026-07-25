
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [resetUrl, setResetUrl] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setResetUrl("");

      const response =
        await forgotPassword({
          email,
        });

      console.log(
        "Reset URL:",
        response.resetUrl
      );

      console.log(
        "Reset Token:",
        response.resetToken
      );

      console.log(
        "Token Length:",
        response.resetToken?.length
      );

      setSuccess(
        response.message ||
          "Password reset link generated successfully"
      );

      setResetUrl(response.resetUrl);

      setEmail("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950">
            Planet Green
          </h1>

          <p className="text-gray-500 mt-2">
            Forgot your password?
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
            {success}
          </div>
        )}

        {resetUrl && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-700 mb-2">
              Development Reset Link:
            </p>

            <a
              href={resetUrl}
              className="text-blue-600 underline break-all"
            >
              Open Reset Password Page
            </a>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
