"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// export const signUpAction = async (formData: FormData) => {
// Compelte this function to allow the user to sign up
// };

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/account");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const createTripAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to create a trip.",
    );
  }

  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    values[key] = value.toString();
  });

  values["user_id"] = user.id;

  const tripData = {
    user_id: values.user_id,
    title: values["trip-name"],
    state_or_country: values.destination,
    city: values.city,
    start_date: values["start-date"],
    end_date: values["end-date"],
  };

  // Checks to see if we are editing a trip that's already created
  const editId = formData.get("edit_id");
  let error;

  if (editId) {
    // Update existing trip
    const { error: updateError } = await supabase
      .from("trips")
      .update(tripData)
      .eq("trip_id", editId);
    error = updateError;
  } else {
    // Create new trip
    const { error: insertError } = await supabase.from("trips").insert([tripData]);
    error = insertError;
  }

  if (error) {
    return encodedRedirect("error", "/trip-planner", error.message);
  }

  return redirect("/my-trips");
};


//  Deletes a trip from the database
//  formData - Form data containing the tripId to delete
//  Redirect to my-trips page on success, error redirect on failure
  
export const deleteTrip = async (formData: FormData) => {
  // Initialize Supabase client
  const supabase = await createClient();
  
  // Get the trip ID from the form data
  const tripId = formData.get("tripId") as string;

  // Attempt to delete the trip from the database
  const { error } = await supabase
    .from("trips")
    .delete()
    .eq("trip_id", tripId);

  // Handle any errors during deletion
  if (error) {
    console.error("Error deleting trip:", error);
    return encodedRedirect(
      "error",
      "/my-trips",
      "Failed to delete trip. Please try again."
    );
  }


  return redirect("/my-trips");
};
