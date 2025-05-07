"use client";
import TopBar from "@/components/TopBar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <div className="container mx-auto px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About TripWise</h1>
        
        <div className="max-w-3xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              TripWise is dedicated to making travel planning effortless and enjoyable. We believe that 
              every journey should be as memorable as the destination itself. Our platform combines 
              intuitive design with powerful features to help you create the perfect travel experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-3">
              <li>Interactive map exploration for discovering new destinations</li>
              <li>Intuitive trip planning tools</li>
              <li>Seamless navigation and location services</li>
              <li>User-friendly interface for all your travel needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We're constantly working to enhance your travel planning experience. Our goal is to 
              become your go-to platform for all things travel, making it easier than ever to 
              explore the world and create unforgettable memories.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
            <p className="text-gray-600 leading-relaxed">
              Ready to start planning your next adventure? Head to our explore page to begin 
              discovering new destinations and creating your perfect itinerary.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 