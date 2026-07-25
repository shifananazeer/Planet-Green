import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await resetPassword(
        token!,
        { password }
      );

      setSuccess(
        "Password updated successfully"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-950 mb-6">
          Reset Password
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}