import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Trip from "./trip";

export default async function Trips() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: tripInformation, error } = await supabase
    .from("trips")
    .select("trip_id, title, start_date, end_date, city, state_or_country")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching trips:", error.message);
    return (
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-red-400 text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Error fetching trip details: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!tripInformation || tripInformation.length === 0) {
    return <div className="p-6 text-gray-600">No trips found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {tripInformation.map((trip) => (
        <Trip
          key={trip.trip_id}
          title={trip.title}
          start_date={trip.start_date}
          end_date={trip.end_date}
          city={trip.city}
          state_or_country={trip.state_or_country}
        />
      ))}
    </div>
  );
}
