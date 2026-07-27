import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold text-blue-950 mb-6">
              Welcome to Planet Green
            </h1>

            <p className="text-lg text-slate-700 mb-8">
              Join Planet Green and build a sustainable future while growing
              your network through our referral system. Connect with people,
              expand your team, and unlock new opportunities.
            </p>

            <div className="flex gap-4">
              <a
                href="/signup"
                className="bg-blue-950 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Get Started
              </a>

              <a
                href="/login"
                className="border border-blue-900 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="/MLM.png"
              alt="Planet Green Network"
              className="w-full max-w-xl rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </section>
    </div>
  );
}