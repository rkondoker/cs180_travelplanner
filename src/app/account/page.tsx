"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  WeatherInfo,
  LocationInfo,
  handleWeather,
} from "@/utils/weather/handleWeather";

type UserData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  joined_on?: Date;
};

const Page = () => {
  const [userData, setUserData] = useState<UserData>({});
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    const Location: LocationInfo = {
      city: "Los Angeles", // Replace with the city you want to fetch the weather for
      stateOrCountry: "CA", // Replace with the state or country
    };

    const fetchWeather = async () => {
      try {
        const weather = await handleWeather(Location);
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    } else {
      console.log("No user data found in local storage");
    }
  }, []);

  const { email, first_name, last_name, joined_on } = userData;
  const formattedDate = joined_on
    ? new Date(joined_on).toLocaleDateString()
    : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData({});
    router.push("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-trip-blue-100 text-white p-6">
      <div className="bg-trip-brown-200 text-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">User Profile</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">First Name:</span> {first_name}
          </p>
          <p>
            <span className="font-semibold">Last Name:</span> {last_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p>
            <span className="font-semibold">Joined:</span> {formattedDate}
          </p>
        </div>

        <h2 className="text-xl font-semibold border-b pt-4 pb-2">
          Current Weather
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Temperature:</span>{" "}
            {weatherData?.temperature}
          </p>
          <p>
            <span className="font-semibold">Condition:</span>{" "}
            {weatherData?.condition}
          </p>
          {weatherData?.icon && (
            <div className="text-3xl">{<weatherData.icon />}</div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-trip-brown-100 hover:scale-105 text-black font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Page;
