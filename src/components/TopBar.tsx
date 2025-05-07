"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 bg-trip-blue-200 bg-opacity-90 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <Link href="/" className="text-trip-brown-100 text-xl font-bold">
            TripWise
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/explore"
              className={`px-4 py-2 rounded-md transition-colors ${
                pathname === "/explore"
                  ? "bg-blue-500 text-white"
                  : "text-trip-brown-100 hover:text-trip-brown-200"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-md transition-colors ${
                pathname === "/about"
                  ? "bg-blue-500 text-white"
                  : "text-trip-brown-100 hover:text-trip-brown-200"
              }`}
            >
              About
            </Link>
            <Link href="/contact" className="text-trip-brown-100 hover:text-trip-brown-200 transition">
              Contact
            </Link>
            
            {/* User Profile Icon */}
            <Link href="/profile" className="text-trip-brown-100 hover:text-trip-brown-200 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 