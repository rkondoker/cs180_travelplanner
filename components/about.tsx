"use client";
import Image from "next/image";
import teamMembers from "@/app/data/Members/members";

const About = () => {
  return (
    <div
      data-testid="about-container"
      className="min-h-screen w-full bg-gradient-to-b from-blue-400 to-green-600"
    >
      <section
        data-testid="team-section"
        className="min-h-[600px] py-16 bg-white/5 flex flex-col justify-center"
      >
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                data-testid="team-member-card"
                className="bg-white/20 p-8 rounded-xl backdrop-blur-sm hover:transform hover:scale-150 transition-transform duration-150"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded">
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

      <section
        data-testid="story-section"
        className="min-h-[600px] py-16 bg-white/10 backdrop-blur-sm flex flex-col justify-center"
      >
        <div className="container mx-auto px-8 max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Our Story
          </h2>
          <div
            data-testid="story-card"
            className="bg-white/20 p-12 rounded-xl backdrop-blur-sm hover:transform hover:scale-110 transition-transform duration-150"
          >
            <p className="text-white/90 text-lg leading-relaxed mb-8">
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

export default About;
