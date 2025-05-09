import Link from "next/link";

const Navbar = () => {
  return (
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
            href="/plantrip"
            className="text-amber-100 text-lg hover:text-gray-300"
          >
            Trip Planner
          </Link>
          <Link
            href="/mytrips"
            className="text-amber-100 text-lg hover:text-gray-300"
          >
            My Trips
          </Link>
        </div>

        {/*<h1>Sample Navigation Bar to Upload to Homepage once devloped
            </h1>*/}
      </div>
    </nav>
  );
};

export default Navbar;
