"use client";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {
  const teamMembers = [
    {
      name: "Jimmy Munoz",
      role: "Project Manager",
      image: "/team/Jimmy.jpg",
    },
    {
      name: "Morad Irshaid",
      role: "Backend Developer",
      image: "/team/Morad.jpg",
    },
    {
      name: "Cade Jordan",
      role: "Frontend Developer",
      image: "/team/Cade.jpg",
    },
    {
      name: "Russell Kondoker ",
      role: "Backend Developer",
      image: "/team/Russell.jpg",
    },
    {
      name: "Ihsan Sarwar",
      role: "Frontend Developer",
      image: "/team/Ihsan.jpg",
    },
    {
      name: "Tegh Gill",
      role: "Backend Developer",
      image: "/team/Tegh.jpg",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-400 to-green-600">
      <section className="min-h-screen flex flex-col items-center justify-center text-white p-8 pt-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-4 animate-fade-in">
            Welcome to TripWise!
          </h1>

          <p className="text-2xl mb-12 animate-fade-in-delay-2">
            Plan your perfect trip with recommendations and smart itinerary
            management
          </p>
          <p className="text-2xl mb-12 animate-fade-in-delay-2">
            Scroll down to learn more about our team and our project!
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
      </section>

      <section className="py-10 bg-white/5">
        <div className="container mx-auto px-8">
          <h2 className="tex5t-5xl font-bold text-center text-white mb-10">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/20 p-8 rounded-xl backdrop-blur-sm"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-amber-200 text-center mb-4">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-30 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-8 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Our Story:
          </h2>
          <div className="bg-white/20 p-8 rounded-xl backdrop-blur-sm">
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              TripWise was born from a simple observation: planning trips can be
              overwhelming and time-consuming. We wanted to create a solution
              that would make travel planning not just easier, but more
              enjoyable.
            </p>
            <p className="text-white/90 text-lg leading-relaxed">
              We believe that everyone deserves to experience the joy of travel
              without the stress of planning, and TripWise is our way of making
              that possible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
