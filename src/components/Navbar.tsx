"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-trip-brown-200 p-6 -xl w-full shadow-lg font-trip-main">
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/"
            className="text-trip-brown-100 text-2xl hover:text-[#f6ead4] hover:scale-105"
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
            href="/account"
            className="text-trip-brown-100 text-lg hover:text-[#f6ead4] hover:scale-105"
          >
            Account
          </Link>
        </div>

        {/*<h1>Sample Navigation Bar to Upload to Homepage once devloped
            </h1>*/}
      </div>
    </nav>
  );
};

export default Navbar;
