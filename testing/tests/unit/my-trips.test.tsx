import { createClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";
import MyTrips from "../../../app/my-trips/page";
import { render, screen } from "@testing-library/react";

// Mock the Supabase client
jest.mock("../../../utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock the Trip component
jest.mock("../../../components/my-trips/trip", () => {
  return function MockTrip({ trip }: { trip: any }) {
    if (!trip) return null;
    return (
      <div data-testid="trip">
        <h2>{trip.title}</h2>
        <p>
          {trip.city}, {trip.state_or_country}
        </p>
      </div>
    );
  };
});

describe("MyTrips Page", () => {
  let mockSupabase: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
      })),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("should redirect to sign-in if user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await MyTrips();
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("should redirect to sign-in if there is an auth error", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("Auth error"),
    });

    await MyTrips();
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("should display error message when trip fetching fails", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user123" } },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: null,
        error: new Error("Failed to fetch trips"),
      }),
    });

    const { container } = render(await MyTrips());
    expect(container).toHaveTextContent("Error fetching trips");
  });

  it("should display no trips message when user has no trips", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user123" } },
      error: null,
    });

    // Mock trips fetch
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "trips") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        };
      }
      // Mock activities fetch
      if (table === "activities") {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
      };
    });

    const { container } = render(await MyTrips());
    expect(container).toHaveTextContent("No trips here!");
  });

  it("should display trips when user has trips", async () => {
    const mockTrips = [
      {
        trip_id: "trip1",
        title: "Trip to Paris",
        state_or_country: "France",
        city: "Paris",
        start_date: "2024-01-01",
        end_date: "2024-01-07",
      },
    ];

    const mockActivities = [
      {
        activity_id: "act1",
        trip_id: "trip1",
        title: "Eiffel Tower Visit",
        description: "Visit the Eiffel Tower",
        date: "2024-01-02",
        location: "Eiffel Tower",
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user123" } },
      error: null,
    });

    // Mock trips fetch
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "trips") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: mockTrips,
            error: null,
          }),
        };
      }
      // Mock activities fetch
      if (table === "activities") {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: mockActivities,
            error: null,
          }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
      };
    });

    const { container } = render(await MyTrips());
    expect(container).toHaveTextContent("Trip to Paris");
    expect(container).toHaveTextContent("Paris, France");
  });

  it("should handle activity fetching error gracefully", async () => {
    const mockTrips = [
      {
        trip_id: "trip1",
        title: "Trip to Paris",
        state_or_country: "France",
        city: "Paris",
        start_date: "2024-01-01",
        end_date: "2024-01-07",
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user123" } },
      error: null,
    });

    // Mock trips fetch
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "trips") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: mockTrips,
            error: null,
          }),
        };
      }
      // Mock activities fetch with error
      if (table === "activities") {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("Failed to fetch activities"),
          }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
      };
    });

    const { container } = render(await MyTrips());
    // Should still display trips even if activities fail to load
    expect(container).toHaveTextContent("Trip to Paris");
  });
});
