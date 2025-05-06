import Example from "@/components/example";
import LogIn from "@/components/login";
import Link from "next/link";
import TopBar from "@/components/TopBar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopBar />
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="text-center z-10">
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to TripWise
          </h1>
          <p className="text-xl text-white mb-8">
            Plan your perfect journey with ease
          </p>
          <div className="space-x-4">
            <button className="bg-trip-brown-100 text-trip-brown-200 px-8 py-3 rounded-full font-semibold hover:bg-[#cbb192] transition">
              Explore
            </button>
            <button className="bg-transparent border-2 border-trip-brown-100 text-trip-brown-100 px-8 py-3 rounded-full font-semibold hover:bg-trip-brown-100 hover:text-trip-brown-200 transition">
              Learn More
            </button>
            <Link href="/login">
              <button className="bg-trip-brown-100 text-trip-brown-200 px-8 py-3 rounded-full font-semibold hover:bg-[#cbb192] transition">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-trip-blue-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-trip-brown-100 text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <h3 className="text-2xl font-semibold text-trip-brown-100 mb-4">
                Easy Planning
              </h3>
              <p className="text-trip-brown-100">
                Create and manage your travel plans with our intuitive interface
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center p-6">
              <h3 className="text-2xl font-semibold text-trip-brown-100 mb-4">
                Smart Suggestions
              </h3>
              <p className="text-trip-brown-100">
                Get personalized recommendations based on your preferences
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center p-6">
              <h3 className="text-2xl font-semibold text-trip-brown-100 mb-4">
                Save & Share
              </h3>
              <p className="text-trip-brown-100">
                Save your plans and share them with friends and family
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
