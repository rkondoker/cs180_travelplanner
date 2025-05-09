// Makes it so anytime tripheader is used it has to pass these 4 props
interface TripHeaderProps {
  tripName: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

// functional react componenet for props
const TripHeader: React.FC<TripHeaderProps> = ({
  tripName,
  destination,
  startDate,
  endDate,
}) => {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#6f4d38] p-6 rounded-t-lg">
      <h1 className="text-4xl font-bold text-white mb-2">
        {tripName} - {destination}
      </h1>
      <h2 className="text-xl text-white">
        {formatDate(startDate)} - {formatDate(endDate)}
      </h2>
    </div>
  );
};

export default TripHeader;

// tan color for possible re-use #D2B48C