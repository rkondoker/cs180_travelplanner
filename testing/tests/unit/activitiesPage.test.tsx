import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ActivitiesPage from "@/app/account/activities/page";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Mock the supabase client
jest.mock("@/utils/supabase/client", () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/AIActivitySuggestions", () => () => null);

describe("ActivitiesPage", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it("shows loading state initially", () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    render(<ActivitiesPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to sign-in if no user", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    render(<ActivitiesPage />);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("shows error message when trips fetch fails", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123" } },
    });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    render(<ActivitiesPage />);
    await waitFor(() => {
      expect(screen.getByText(/Error fetching trips/)).toBeInTheDocument();
    });
  });

  it("shows no trips message when user has no trips", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123" } },
    });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    render(<ActivitiesPage />);
    await waitFor(() => {
      expect(screen.getByText("No Trips Found")).toBeInTheDocument();
      expect(screen.getByText("Create a Trip")).toBeInTheDocument();
    });
  });

  it("renders activity form when trips are available", async () => {
    const mockTrips = [
      {
        trip_id: "1",
        title: "Test Trip",
        start_date: "2024-03-20",
        end_date: "2024-03-25",
        city: "Los Angeles",
        state_or_country: "CA",
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123" } },
    });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockTrips, error: null }),
    });

    render(<ActivitiesPage />);
    await waitFor(() => {
      expect(screen.getByText("Add Activity to Trip")).toBeInTheDocument();
      expect(screen.getByLabelText("Select Trip")).toBeInTheDocument();
    });
  });

  it("submits activity form successfully", async () => {
    const mockTrips = [
      {
        trip_id: "1",
        title: "Test Trip",
        start_date: "2024-03-20",
        end_date: "2024-03-25",
        city: "Los Angeles",
        state_or_country: "CA",
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123" } },
    });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockTrips, error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Select Trip")).toBeInTheDocument();
    });

    // Select a trip
    fireEvent.change(screen.getByLabelText("Select Trip"), {
      target: { value: "1" },
    });

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Activity Name"), {
      target: { value: "Test Activity" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2024-03-21" },
    });

    // Submit the form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith("activities");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
