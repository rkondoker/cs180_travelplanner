"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

const backgroundImages = [
  "/images/background1.jpg",
  "/images/background2.jpg",
  "/images/background3.jpg",
  "/images/background4.jpg",
  "/images/background5.jpg",
  "/images/background6.jpg",
  "/images/background7.jpg",
  "/images/background8.jpg",
  "/images/background9.jpg",
  "/images/background10.jpg",
  "/images/background11.jpg",
];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    console.log("Loading image:", backgroundImages[currentImageIndex]);
  }, [currentImageIndex]);

  useEffect(() => {
    const changeBackground = () => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % backgroundImages.length,
        );
        setIsTransitioning(false);
      }, 1000);
    };

    const interval = setInterval(changeBackground, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentImageIndex && !isTransitioning
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              onError={() => {
                console.error(`Failed to load image: ${image}`);
              }}
            />
          </div>
        ))}
      </div>

      <section className="relative min-h-screen flex flex-col items-center justify-center text-white p-8 pt-24">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-12 shadow-2xl border border-white/20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-4 animate-fade-in">
              Welcome to TripWise!
            </h1>
            <p className="text-2xl mb-12 animate-fade-in-delay-2">
              Plan your perfect trip with recommendations and smart itinerary
              management
            </p>
            <p className="text-2xl mb-12 animate-fade-in-delay-2">
              Learn more about our team and project in the About Us section!
            </p>

            <div className="flex justify-center gap-6 animate-fade-in-delay-3">
              <Link
                href="/sign-in"
                className="bg-blue-500 hover:bg-green-600 text-white 
                font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="bg-blue-500 hover:bg-green-600 text-white 
                font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
