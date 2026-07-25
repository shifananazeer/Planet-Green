import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
   <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-950 mb-6">
            Welcome to Planet Green
          </h1>

          <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-8">
            Join Planet Green and build a sustainable future while growing
            your network through our binary referral system.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="bg-blue-950 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="border border-blue-900 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Login
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}