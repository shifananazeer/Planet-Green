
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3">
          {/* <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-blue-950">
            PG
          </div> */}

          <div>
            <h1 className="text-xl font-bold tracking-wide">
              Planet Green
            </h1>
            <p className="text-xs text-blue-200">
              Grow Together
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-blue-400 hover:bg-blue-900 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-green-500 text-blue-950 font-semibold hover:bg-green-400 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
