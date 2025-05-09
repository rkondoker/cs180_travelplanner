"use client";

import { useState } from "react";

const TripPlanner = () => {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    activities: "",
    tripName: "",
  });

  const fields = [
    { label: "Destination", type: "text", name: "destination" },
    { label: "Start Date", type: "date", name: "startDate" },
    { label: "End Date", type: "date", name: "endDate" },
    { label: "Activities", type: "text", name: "activities" },
    { label: "Trip Name", type: "text", name: "tripName" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-trip-brown-200 p-8 rounded-xl w-[32rem] shadow-lg font-trip-main">
        <h2 className="text-white text-3xl font-bold mb-6 border-b border-white pb-2">
          Trip Planner
        </h2>

        {/* <form onSubmit={handleSubmit}> done later on */}
        {fields.map((field) => (
          <div className="mb-6" key={field.name}>
            <label className="block text-white text-sm mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={(e) =>
                setFormData({ ...formData, [field.name]: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-white text-black"
              required
            />
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-trip-brown-100 w-1/4 text-trip-brown-200 px-4 py-2 ml-1 rounded-full font-semibold hover:bg-[#cbb192] transition"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
