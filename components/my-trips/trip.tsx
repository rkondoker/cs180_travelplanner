"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { deleteTrip } from "@/app/actions";
import Activity from "@/components/my-trips/activity";
import { LocationInfo } from "@/utils/weather/handleWeather";
import { handleWeather } from "@/utils/weather/handleWeather";

interface ActivityProps {
  id: string;
  trip_id: string;
  name: string;
  description: string;
  date: string;
}

type TripProps = {
  trip_id: string;
  title: string;
  start_date: string;
  end_date: string;
  city: string;
  state_or_country: string;
  activities?: ActivityProps[];
};

function addOneDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Trip({
  trip_id,
  title,
  start_date,
  end_date,
  city,
  state_or_country,
  activities = [],
}: TripProps) {
  const [showActivities, setShowActivities] = useState(false);
  const formattedStart = addOneDay(start_date);
  const formattedEnd = addOneDay(end_date);

  const location: LocationInfo = {
    city: city,
    stateOrCountry: state_or_country,
  };

  const weatherData = await handleWeather(location);

  return (
    <div className="bg-trip-brown-100 rounded-xl p-6 w-full text-white font-trip-main">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          {title} – {city}, {state_or_country}
        </h2>
        <p> Weather: {weatherData?.condition}</p>
        <p> Temperature: {weatherData?.temperature}°F</p>
        {weatherData?.icon && <weatherData.icon size={48} />}
        <p className="text-sm mt-1">
          {formattedStart} – {formattedEnd}
        </p>
      </div>

      <div className="bg-white text-black text-xl font-semibold flex items-center justify-center py-12 rounded-lg">
        Map here
      </div>

      <div className="mt-6 text-sm w-full">
        <span className="font-bold">Activities:</span>
        <div className="inline-block ml-2">
          <button
            onClick={() => setShowActivities((prev) => !prev)}
            className="text-trip-brown-200 hover:text-white flex items-center gap-1"
            aria-label="Toggle activities"
          >
            View Activities
            <ChevronDown
              className={`h-4 w-4 transform transition-transform ${showActivities ? "rotate-180" : ""}`}
            />
          </button>
          {showActivities && (
            <div className="mt-2 w-full bg-white rounded-md shadow-lg py-1 z-10">
              {activities.length > 0 ? (
                activities.map(
                  ({ id, trip_id, name, description, date }, index) => (
                    <div key={index} className="w-full">
                      <Activity
                        key={index}
                        id={id}
                        trip_id={trip_id}
                        name={name}
                        description={description}
                        date={date}
                      />
                    </div>
                  ),
                )
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No activities yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/trip-planner?edit=${trip_id}`}
          className="text-trip-blue-200 hover:text-trip-blue-100 px-3 py-1 rounded"
        >
          Modify
        </Link>
        <form action={deleteTrip} className="inline">
          <input type="hidden" name="tripId" value={trip_id} />
          <button
            type="submit"
            className="text-trip-red-100 hover:text-red-700 px-3 py-1 rounded"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
