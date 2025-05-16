import weatherIcons from "@/data/weather/weatherIcons";
import type { IconType } from "react-icons";

export type WeatherInfo = {
  temperature: number;
  condition: string;
  code: number;
  icon: IconType;
};

export type LocationInfo = {
  city: string;
  stateOrCountry: string;
};

export const handleWeather = async ({ city, stateOrCountry }: LocationInfo) => {
  const weather = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${city}, ${stateOrCountry}&aqi=no`,
  );

  if (!weather.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const weatherData = await weather.json();

  const code = weatherData.current.condition.code;
  const isDay = weatherData.current.is_day.toString() as "1" | "0";
  const Icon = weatherIcons[code]?.[isDay];

  const weatherInfo: WeatherInfo = {
    temperature: weatherData.current.temp_f,
    condition: weatherData.current.condition.text,
    code: code,
    icon: Icon ?? (() => null),
  };

  return weatherInfo;
};
