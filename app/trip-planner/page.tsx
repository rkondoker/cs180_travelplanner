import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";

export default async function Login() {
  return (
    <div className="flex flex-col items-center justify-center mt-5 bg-trip-brown-100 rounded-xl p-8 font-trip-main">
      <form className="flex flex-col min-w-64 items-stretch justify-center w-full max-w-sm">
        <h1 className="text-2xl font-trip-main">Trip Planner</h1>
        <div className="flex flex-col items-center justify-center gap-2 mt-8">
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="trip-name">Trip Name</Label>
            <input className="rounded-xl px-3" name="trip-name" required />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="country">Country</Label>
            <input
              className="px-3 rounded-xl"
              name="destination"
              placeholder="United States of America"
              required
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="city">City</Label>
            <input
              className="px-3 rounded-xl"
              name="city"
              placeholder="Riverside"
              required
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <input
              className="rounded-xl px-3"
              type="date"
              name="start date"
              required
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <input
              className="rounded-xl px-3"
              type="date"
              name="end date"
              required
            />
          </div>
          <SubmitButton
            pendingText="Creating Trip.."
            // formAction={signInAction}
            className="bg-trip-blue-200 w-1/4 text-trip-brown-100 px-16 py-2 rounded-full font-semibold hover:scale-105 transition"
          >
            Create Trip
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
