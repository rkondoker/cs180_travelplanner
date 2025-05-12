"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  joined_on?: Date;
};

const Page = () => {
  const [userData, setUserData] = useState<UserData>({});
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    } else {
      console.log("No user data found in local storage");
    }
  }, []);

  const { email, first_name, last_name, joined_on } = userData;
  const formattedDate = joined_on
    ? new Date(joined_on).toLocaleDateString()
    : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData({});
    router.push("/");
  };
  return (
    <div className="flex flex-col items-center justify-center bg-trip-blue-100 text-white">
      <p>First Name: {first_name}</p>
      <p>Last Name: {last_name}</p>
      <p>Email: {email}</p>
      <p>Joined: {formattedDate}</p>
      <button
        className="bg-trip-brown-100 p-4 text-white"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default Page;
