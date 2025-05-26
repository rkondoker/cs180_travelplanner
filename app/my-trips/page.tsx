import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Trip from "./trip";
import Link from "next/link";


interface Activity {
  activity_id: string;
  trip_id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default async function MyTrips() {
 
  const supabase = await createClient();


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();


  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Fetch all trips for the authenticated user
  const { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id);

  // Display error message if trip fetching fails
  if (tripsError) {
    return (
      <div className="flex flex-col items-center justify-center m-10 w-3/4 bg-trip-brown-100 rounded-xl p-8 font-trip-main">
        <div className="flex items-center gap-2 text-red-500">
          <InfoIcon className="h-5 w-5" />
          <p>Error fetching trips. Please try again.</p>
        </div>
      </div>
    );
  }

  // Fetches the activities for all trips of the current user
  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select("*")
    .in(
      "trip_id",
      trips?.map((trip) => trip.trip_id) || []
    );

  // Log any errors in fetching activities
  if (activitiesError) {
    console.error("Error fetching activities:", activitiesError);
  }

  // This will help group the activities through a trip ID
  // Creates an object so each key will be a trip ID and the value is in an arr of activities for that trip
  const activitiesByTrip = (activities || []).reduce((acc, activity) => {
    if (!acc[activity.trip_id]) {
      acc[activity.trip_id] = [];
    }
    acc[activity.trip_id].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        {}
        <h1 className="text-3xl font-bold text-trip-brown-200 mb-8">My Trips</h1>
        
        {}
        {!trips || trips.length === 0 ? (
          // When no trip exists
          <div className="flex flex-col items-center justify-center p-12 bg-trip-brown-100 rounded-xl">
            <p className="text-2xl text-trip-brown-200 font-semibold mb-6">No trips here! Would you like to make one?</p>
          </div>
        ) : (
          // Display list of trips if they exist
          <div className="flex flex-col gap-6 p-6 w-full">
            {trips.map((trip) => (
              <Trip
                key={trip.trip_id}
                trip_id={trip.trip_id}
                title={trip.title}
                state_or_country={trip.state_or_country}
                city={trip.city}
                start_date={trip.start_date}
                end_date={trip.end_date}
                activities={activitiesByTrip[trip.trip_id] || []}
              />
            ))}
          </div>
        )}
      </div>

      {/* button that goes to trip planner page */}
      <div className="fixed bottom-8 right-8">
        <Link
          href="/trip-planner"
          className="bg-trip-brown-200 text-trip-brown-100 px-8 py-3 rounded-full font-semibold hover:scale-105 hover:bg-trip-brown-200 transition shadow-lg"
        >
          Create Trip
        </Link>
      </div>
    </div>
  );
}
