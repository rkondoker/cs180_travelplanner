"use client";

import { useEffect, useState } from "react";
import TripHeader from "@/components/tripheader";
import GoogleMap from "@/components/googlemap";

const tripId = 1; // Hardcoded for now; replace with dynamic value as needed

const Page = () => {
  const [trip, setTrip] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tripRes = await fetch(`http://localhost:8080/trips/${tripId}`);
        if (!tripRes.ok) throw new Error("Failed to fetch trip");
        const tripData = await tripRes.json();
        setTrip(tripData);

        const actRes = await fetch(`http://localhost:8080/trips/${tripId}/activities`);
        if (!actRes.ok) throw new Error("Failed to fetch activities");
        const actData = await actRes.json();
        setActivities(actData);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!trip) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No trip found.</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#6f4d38", borderRadius: 20, overflow: "hidden" }}>
      <TripHeader
        tripName={trip.title}
        destination={trip.destination || "Hawaii"}
        startDate={new Date(trip.startDate)}
        endDate={new Date(trip.endDate)}
      />
      <div style={{ background: "#fff", padding: 0 }}>
        <GoogleMap />
      </div>
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "#fff", fontWeight: 600, fontSize: 20, marginBottom: 12 }}>Activities:</h2>
        <ul style={{ color: "#fff", fontSize: 16 }}>
          {activities.length === 0 ? (
            <li>No activities found.</li>
          ) : (
            activities.map((activity, idx) => (
              <li key={activity.activityId || idx} style={{ marginBottom: 8 }}>
                • {activity.name} {activity.location ? `@ ${activity.location}` : ""}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Page;
