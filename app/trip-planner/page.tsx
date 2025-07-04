import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { createTripAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";

const fields = [
  { label: "Trip Name", name: "trip-name", type: "text", placeholder: "" },
  {
    label: "State or Country",
    name: "destination",
    type: "text",
    placeholder: "California or United States of America",
  },
  { label: "City", name: "city", type: "text", placeholder: "Riverside" },
  { label: "Start Date", name: "start-date", type: "date", placeholder: "" },
  { label: "End Date", name: "end-date", type: "date", placeholder: "" },
];

export default async function TripPlanner({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  // Initialize trip data
  let tripData = null;
  const editId = searchParams?.edit;

  // If we're in edit mode lets fetch the trip data
  if (editId) {
    const supabase = await createClient();
    const { data: trip } = await supabase
      .from("trips")
      .select("*")
      .eq("trip_id", editId)
      .single();

    if (trip) {
      tripData = {
        "trip-name": trip.title,
        destination: trip.state_or_country,
        city: trip.city,
        "start-date": trip.start_date,
        "end-date": trip.end_date,
      };
    }
  }

  return (
    <div
      data-testid="trip-planner-container"
      className="flex flex-col items-center justify-center m-10 w-3/4 bg-trip-brown-100 rounded-xl p-8 font-trip-main"
    >
      <form className="flex flex-col w-11/12 items-stretch w-full text-3xl font-trip-main">
        {editId ? "Edit Trip" : "Create Trip"}
        {editId && <input type="hidden" name="edit_id" value={editId} />}
        <div className="flex flex-col text-xl gap-2 mt-8">
          {fields.map(({ label, name, type, placeholder }) => (
            <div
              key={name}
              className="flex flex-col justify-start w-full items-start gap-2"
            >
              <Label htmlFor={name}>{label}</Label>
              <input
                className="px-3 w-full rounded-xl"
                type={type}
                name={name}
                placeholder={placeholder}
                defaultValue={tripData?.[name] || ""}
                required
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-5">
          <SubmitButton
            pendingText={editId ? "Updating Trip..." : "Creating Trip..."}
            formAction={createTripAction}
            className="bg-trip-blue-200 w-1/5 justify-center mt-5 items-center text-trip-brown-100 px-16 py-2 rounded-full font-semibold hover:scale-105 hover:bg-trip-blue-200 transition"
          >
            {editId ? "Update Trip" : "Create Trip"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
