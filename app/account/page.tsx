import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { handleWeather, LocationInfo } from "@/utils/weather/handleWeather";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const location: LocationInfo = {
    city: "Riverside",
    stateOrCountry: "California",
  };

  const weatherData = await handleWeather(location);

  const { data: userInformation, error } = await supabase
    .from("users")
    .select("username, joined_on")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user details:", error);
    return (
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-red-400 text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Error fetching user details: {error.message}
          </div>
        </div>
      </div>
    );
  }

  const { username, joined_on } = userInformation;

  return (
    <div className="min-h-screen flex items-center justify-center bg-trip-blue-100 text-white p-6">
      <div className="bg-trip-brown-200 text-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Your Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Welcome, </strong> {username}
          </p>
          <p>
            <strong>Joined on:</strong>{" "}
            {new Date(joined_on).toLocaleDateString()}
          </p>
          <p> Weather: {weatherData?.condition}</p>
          <p> Temperature: {weatherData?.temperature}°F</p>
          <p>
            {" "}
            Location: {location.city}, {location.stateOrCountry}
          </p>
          {weatherData?.icon && <weatherData.icon size={48} />}
        </div>
      </div>
    </div>
  );
}
