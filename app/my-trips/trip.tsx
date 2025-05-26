function addOneDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type TripProps = {
  title: string;
  start_date: string;
  end_date: string;
  city: string;
  state_or_country: string;
};

export default function Trip({
  title,
  start_date,
  end_date,
  city,
  state_or_country,
}: TripProps) {
  const formattedStart = addOneDay(start_date);
  const formattedEnd = addOneDay(end_date);

  return (
    <div className="bg-trip-brown-100 rounded-xl p-6 w-full text-white font-trip-main">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          {title} – {city}, {state_or_country}
        </h2>
        <p className="text-sm mt-1">
          {formattedStart} – {formattedEnd}
        </p>
      </div>

      <div className="bg-white text-black text-xl font-semibold flex items-center justify-center py-12 rounded-lg">
        Map here
      </div>

      <div className="mt-6 text-sm">
        <span className="font-bold">Activities:</span>
        <p className="text-trip-brown-200 italic">Coming soon...</p>
      </div>
    </div>
  );
}
