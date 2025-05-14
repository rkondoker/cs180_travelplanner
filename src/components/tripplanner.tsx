"use client";
import { useState } from "react";
//Russell added changes
import { useRouter } from "next/navigation";
import { TripFormData, handleTripCreation } from "@/utils/trips/handleTrips";

/*
const TripPlanner = () => {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    activities: "",
    tripName: "",
  });
*/
const TripPlanner = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TripFormData>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await handleTripCreation(formData);
      setError(null);
      localStorage.setItem("response", JSON.stringify(response));
      router.push("/account");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fields = [
    { label: "Destination", type: "text", name: "destination" },
    { label: "Start Date", type: "date", name: "startDate" },
    { label: "End Date", type: "date", name: "endDate" },
    { label: "Activities", type: "text", name: "activities" },
    { label: "Trip Name", type: "text", name: "tripName" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute top-50 left-1/2 transform -translate-x-1/2 z-10">
        {error && (
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
      <div className="bg-trip-brown-200 p-8 rounded-xl w-[32rem] shadow-lg font-trip-main">
        <form onSubmit={handleSubmit}>
          <h2 className="text-white text-3xl font-bold mb-6 border-b border-white pb-2">
            Trip Planner
          </h2>

          {fields.map((field) => (
            <div className="mb-6" key={field.name}>
              <label className="block text-white text-sm mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                className="w-full px-3 py-2 rounded bg-white text-black"
                onChange={handleChange}
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
        </form>
      </div>
    </div>
  );
};
export default TripPlanner;

/*

  /*
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-trip-brown-200 p-8 rounded-xl w-[32rem] shadow-lg font-trip-main">
        <h2 className="text-white text-3xl font-bold mb-6 border-b border-white pb-2">
          Trip Planner
        </h2>

        {<form onSubmit={handleSubmit}}
        {fields.map((field) => (
          <div className="mb-6" key={field.name}>
            <label className="block text-white text-sm mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              /
              onChange={handleChange}
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



  */
