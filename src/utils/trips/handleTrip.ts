export type TripFormData = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  activities?: string;
  tripName?: string;
};

export const handleTripCreation = async (formData: TripFormData) => {
  const { destination, startDate, endDate, activities, tripName } = formData;

  if (!destination || !startDate || !endDate || !tripName) {
    throw new Error("All fields are required");
  }

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    throw new Error("User not logged in");
  }
  const user = JSON.parse(userStr);

  const response = await fetch("http://localhost:8080/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.user_id,
      title: tripName,
      startDate,
      endDate,
      activities: activities?.split(",").map((activity) => activity.trim()),
      destination,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create trip");
  }

  return await response.json();
};
