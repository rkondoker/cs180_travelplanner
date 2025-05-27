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
            className="text-trip-brown-100 text-2xl hover:text-[#f6ead4]"
          >
            TripWise
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href="/trip-planner"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            Trip Planner
          </Link>
          <Link
            href="/my-trips"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            My Trips
          </Link>
          <Link
            
            href="/account/activities"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            Activities

          </Link>
          <button
            type="submit"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
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
            className="text-trip-brown-100 text-2xl hover:text-[#f6ead4]"
          >
            TripWise
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href="/explore"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            Explore
          </Link>
          <Link
            href="/sign-in"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
