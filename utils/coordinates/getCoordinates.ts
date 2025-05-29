type Location = {
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

const getCoordinates = async (location: Location) => {
  const { street_address, city, state, postal_code, country } = location;
  const address = `${street_address}, ${city}, ${state}, ${postal_code}, ${country}`;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  console.log(encodeURIComponent(address));

  if (!res.ok) {
    throw new Error("Address not valid, please try again.");
  }

  const data = await res.json();
  const result = data.results[0];
  console.log(result);

  return {
    longitude: result.geometry.location.lng,
    latitude: result.geometry.location.lat,
  };
};

export default getCoordinates;
