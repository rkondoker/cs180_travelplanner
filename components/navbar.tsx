import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

const Navbar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <div className="bg-red-400 p-6 text-3xl">
        You are missing the keys in your .env.local file
      </div>
    );
  }
  return user ? (
    <nav className="bg-trip-brown-200 p-6 -xl w-full shadow-lg font-trip-main">
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/"
            className="text-amber--200 text-2xl hover:text-gray-300"
          >
            TripWise
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href="/trip-planner"
            className="text-amber-100 text-lg hover:text-gray-300"
          >
            Trip Planner
          </Link>
          <Link
            href="/my-trips"
            className="text-amber-100 text-lg hover:text-gray-300"
          >
            My Trips
          </Link>
          <button
            type="submit"
            className="text-amber-100 text-lg hover:text-gray-300"
            onClick={signOutAction}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  ) : (
    <nav className="bg-trip-brown-200 p-6 -xl w-full shadow-lg font-trip-main">
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/"
            className="text-amber--200 text-2xl hover:text-gray-300"
          >
            TripWise
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href="/sign-in"
            className="text-amber-100 text-lg hover:text-gray-300"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-amber-100 text-lg hover:text-gray-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
