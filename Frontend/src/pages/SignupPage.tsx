
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { signup } from "../services/authService";

export default function SignupPage() {
  const [searchParams] = useSearchParams();

  const referralCode = searchParams.get("ref") || "";
  const position = searchParams.get("position") || "";

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  referralCode: referralCode || "",
});

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

     const payload = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  referralCode:
    formData.referralCode || undefined,
  position: position || undefined,
};

      const response = await signup(payload);

      console.log(response);

      navigate("/user/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Signup failed"
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
            Create your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

        <div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Referral Code
  </label>

  <input
    type="text"
    name="referralCode"
    value={formData.referralCode}
    onChange={handleChange}
    placeholder="Enter referral code"
    readOnly={!!referralCode}
    className={`w-full border border-gray-300 rounded-lg px-4 py-3 ${
      referralCode
        ? "bg-gray-100 cursor-not-allowed"
        : "focus:outline-none focus:ring-2 focus:ring-green-500"
    }`}
  />

  {referralCode && (
    <p className="text-xs text-green-600 mt-1">
      Referral code applied from invitation link
    </p>
  )}
</div>
          {position && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Position
              </label>

              <input
                value={position.toUpperCase()}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
