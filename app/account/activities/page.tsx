"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Trip = {
  trip_id: string;
  title: string;
  start_date: string;
  end_date: string;
  city: string;
  state_or_country: string;
};

export default function ActivitiesPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const location = [
    {
      name: "street_address",
      type: "text",
      label: "Street Address",
      placeholder: "e.g., 123 Next St",
    },
    {
      name: "city",
      type: "text",
      label: "City",
      placeholder: "e.g., Riverside",
    },
    {
      name: "state",
      type: "text",
      label: "State",
      placeholder: "e.g., California",
    },
    {
      name: "postal_code",
      type: "text",
      label: "Postal Code",
      placeholder: "e.g., 92635",
    },
    {
      name: "country",
      type: "text",
      label: "Country",
      placeholder: "e.g., United States",
    },
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        const { data: tripData, error: tripError } = await supabase
          .from("trips")
          .select(
            "trip_id, title, start_date, end_date, city, state_or_country",
          )
          .eq("user_id", user.id);

        if (tripError) {
          setError("Error fetching trips: " + tripError.message);
        } else {
          setTrips(tripData || []);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(`An unexpected error occurred: ${error.message}`);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [router, supabase]);

  const handleActivitySubmit = async (formData: FormData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const activityData = {
        trip_id: selectedTrip,
        name: formData.get("activity-name"),
        description: formData.get("description"),
        date: formData.get("date"),
        street_address: formData.get("street_address"),
        city: formData.get("city"),
        state: formData.get("state"),
        postal_code: formData.get("postal_code"),
        country: formData.get("country"),
        start_time: formData.get("start-time"),
        end_time: formData.get("end-time"),
      };

      const { error } = await supabase
        .from("activities")
        .insert([activityData]);

      if (error) {
        setError("Error creating activity: " + error.message);
      } else {
        // Reset form and show success message
        setSelectedTrip("");
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`An unexpected error occurred: ${error.message}`);
      } else {
        setError("An unexpected error occurred while creating the activity");
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-spin flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-400 text-white p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-trip-brown-200 text-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">No Trips Found</h2>
          <p className="mb-6">
            You need to create a trip before adding activities.
          </p>
          <Link
            href="/trip-planner"
            className="bg-trip-brown-100 text-trip-brown-200 px-6 py-2 rounded-full font-semibold hover:bg-[#cbb192] hover:scale-105 transition inline-block"
          >
            Create a Trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-trip-brown-200 text-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">Add Activity to Trip</h2>

        <div className="mb-6">
          <Label htmlFor="trip-select" className="text-white mb-2 block">
            Select Trip
          </Label>
          <select
            id="trip-select"
            value={selectedTrip}
            onChange={(e) => setSelectedTrip(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white text-black"
            required
          >
            <option value="">Choose a trip...</option>
            {trips.map((trip) => (
              <option key={trip.trip_id} value={trip.trip_id}>
                {trip.title} - {trip.city}, {trip.state_or_country}
              </option>
            ))}
          </select>
        </div>

        {selectedTrip && (
          <form className="space-y-4" action={handleActivitySubmit}>
            <div>
              <Label htmlFor="activity-name" className="text-white mb-2 block">
                Activity Name
              </Label>
              <input
                id="activity-name"
                name="activity-name"
                type="text"
                required
                className="w-full px-3 py-2 rounded bg-white text-black"
                placeholder="e.g., Visit Golden Gate Bridge"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white mb-2 block">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                required
                className="w-full px-3 py-2 rounded bg-white text-black"
                placeholder="Describe your activity..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-white mb-2 block">
                Date
              </Label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="w-full px-3 py-2 rounded bg-white text-black"
              />
            </div>

            {location.map(({ name, type, label, placeholder }, index) => (
              <div key={index}>
                <Label htmlFor={name} className="text-white mb-2 block">
                  {label}
                </Label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  required
                  className="w-full px-3 py-2 rounded bg-white text-black"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="text-white mb-2 block">
                  Start Time
                </Label>
                <input
                  id="start-time"
                  name="start-time"
                  type="time"
                  required
                  className="w-full px-3 py-2 rounded bg-white text-black"
                />
              </div>

              <div>
                <Label htmlFor="end-time" className="text-white mb-2 block">
                  End Time
                </Label>
                <input
                  id="end-time"
                  name="end-time"
                  type="time"
                  required
                  className="w-full px-3 py-2 rounded bg-white text-black"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <SubmitButton
                pendingText="Creating Activity..."
                className="bg-trip-brown-100 text-trip-brown-200 px-8 py-2 rounded-full font-semibold hover:bg-[#cbb192] hover:scale-105 transition"
              >
                Add Activity
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
