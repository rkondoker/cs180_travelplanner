import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";

const fields = [
  { label: "Trip Name", name: "trip-name", type: "text", placeholder: "" },
  {
    label: "Country",
    name: "destination",
    type: "text",
    placeholder: "United States of America",
  },
  { label: "City", name: "city", type: "text", placeholder: "Riverside" },
  { label: "Start Date", name: "start-date", type: "date", placeholder: "" },
  { label: "End Date", name: "end-date", type: "date", placeholder: "" },
];

export default async function Login() {
  return (
    <div className="flex flex-col items-center justify-center m-10 w-3/4 bg-trip-brown-100 rounded-xl p-8 font-trip-main">
      <form className="flex flex-col w-11/12 items-stretch w-full text-3xl font-trip-main">
        {" "}
        Trip Planner
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
                required
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-5">
          <SubmitButton
            pendingText="Creating Trip.."
            // formAction={signInAction}
            className="bg-trip-blue-200 w-1/5 justify-center mt-5 items-center text-trip-brown-100 px-16 py-2 rounded-full font-semibold hover:scale-105 hover:bg-trip-blue-200 transition"
          >
            Create Trip
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
