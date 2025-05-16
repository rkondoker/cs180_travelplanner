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
    <div className="flex flex-col items-center justify-center bg-trip-blue-100 text-white">
      <p>First Name: {first_name}</p>
      <p>Last Name: {last_name}</p>
      <p>Email: {email}</p>
      <p>Joined: {formattedDate}</p>
      <p>Weather: {weatherData?.temperature} </p>
      <p>Weather: {weatherData?.condition} </p>
      {weatherData?.icon && <weatherData.icon className="text-3xl" />}
      <button
        className="bg-trip-brown-100 p-4 text-white"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default Page;
