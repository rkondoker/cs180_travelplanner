import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ActivitiesPage from "@/app/account/activities/page";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock the supabase client
jest.mock("@/utils/supabase/client", () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/AIActivitySuggestions", () => () => null);

// Mock the fetch function
global.fetch = jest.fn();

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
    // Mock fetch to reject
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Database error"),
    );

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("No Trips Found")).toBeInTheDocument();
      expect(
        screen.getByText("You need to create a trip before adding activities."),
      ).toBeInTheDocument();
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
    // Mock successful trips fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: "Test Trip" }]),
    });

    // Mock successful activity creation
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Activity added successfully" }),
    });

    render(<ActivitiesPage />);

    // Wait for trips to load
    await waitFor(() => {
      expect(screen.getByText("Test Trip")).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Trip"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Activity Name"), {
      target: { value: "Test Activity" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Street Address"), {
      target: { value: "123 Test St" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText("State"), {
      target: { value: "Test State" },
    });
    fireEvent.change(screen.getByLabelText("Postal Code"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText("Country"), {
      target: { value: "Test Country" },
    });
    fireEvent.change(screen.getByLabelText("Start Time"), {
      target: { value: "09:00" },
    });
    fireEvent.change(screen.getByLabelText("End Time"), {
      target: { value: "10:00" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Activity"));

    // Check for success message
    await waitFor(() => {
      expect(
        screen.getByText("Activity added successfully"),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching trips", () => {
    // Mock fetch to delay response
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}),
    );

    render(<ActivitiesPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles form validation errors", async () => {
    // Mock successful trips fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: "Test Trip" }]),
    });

    render(<ActivitiesPage />);

    // Wait for trips to load
    await waitFor(() => {
      expect(screen.getByText("Test Trip")).toBeInTheDocument();
    });

    // Try to submit without filling required fields
    fireEvent.click(screen.getByText("Add Activity"));

    // Check for validation messages
    expect(screen.getByText("Activity name is required")).toBeInTheDocument();
    expect(screen.getByText("Date is required")).toBeInTheDocument();
  });
});
