interface ActivityProps {
  id: string;
  trip_id: string;
  name: string;
  description: string;
  date: string;
}

const Activity = ({ id, trip_id, name, description, date }: ActivityProps) => {
  console.log(id, trip_id, name, description, date);
  return (
    <div className="text-gray-700 flex justify-between w-[20vw] p-2">
      <p>{name}</p>
      <div className="flex gap-4">
        <button className="text-trip-blue-200 hover:text-trip-blue-100">
          Modify
        </button>
        <button className="text-trip-red-100 hover:text-red-700">Delete</button>
      </div>
    </div>
  );
};

export default Activity;
