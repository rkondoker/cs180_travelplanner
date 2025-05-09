import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-green-300 text-gray p-8">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to TripWise</h1>
        <p className="text-xl mb-8">Your Next Adventure Awaits</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white 
          font-bold py-3 px-8 rounded-full transition duration-300"
          >
            Log In
          </Link>

          <Link
            href="/createaccount"
            className="bg-blue-500 hover:bg-blue-600 text-white 
          font-bold py-3 px-8 rounded-full transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
