import { render, screen } from "@testing-library/react";
import TripPlanner from "../../../app/trip-planner/page";
import { createClient } from "../../../utils/supabase/server";

// Mock the Supabase client
jest.mock("../../../utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mock the SubmitButton component
jest.mock("../../../components/submit-button", () => ({
  SubmitButton: ({ children, formAction, pendingText, className }: any) => (
    <button
      data-testid="submit-button"
      formAction={formAction}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe("TripPlanner Page", () => {
  let mockSupabase: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock Supabase client
    mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("renders create trip form by default", async () => {
    render(await TripPlanner({ searchParams: {} }));

    // Check heading
    expect(screen.getByText("Create Trip")).toBeInTheDocument();

    // Check form fields
    expect(screen.getByLabelText("Trip Name")).toBeInTheDocument();
    expect(screen.getByLabelText("State or Country")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();

    // Check submit button
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toHaveTextContent("Create Trip");
  });

  it("renders edit trip form when edit ID is provided", async () => {
    const mockTrip = {
      trip_id: "trip1",
      title: "Paris Vacation",
      state_or_country: "France",
      city: "Paris",
      start_date: "2024-01-01",
      end_date: "2024-01-07",
    };

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockTrip, error: null }),
    });

    render(await TripPlanner({ searchParams: { edit: "trip1" } }));

    // Check heading
    expect(screen.getByText("Edit Trip")).toBeInTheDocument();

    // Check form fields with pre-filled values
    expect(screen.getByLabelText("Trip Name")).toHaveValue("Paris Vacation");
    expect(screen.getByLabelText("State or Country")).toHaveValue("France");
    expect(screen.getByLabelText("City")).toHaveValue("Paris");
    expect(screen.getByLabelText("Start Date")).toHaveValue("2024-01-01");
    expect(screen.getByLabelText("End Date")).toHaveValue("2024-01-07");

    // Check submit button
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toHaveTextContent("Update Trip");
  });

  it("handles trip fetch error gracefully", async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: new Error("Failed to fetch trip") }),
    });

    render(await TripPlanner({ searchParams: { edit: "trip1" } }));

    // Should still render the form with empty fields
    expect(screen.getByLabelText("Trip Name")).toHaveValue("");
    expect(screen.getByLabelText("State or Country")).toHaveValue("");
    expect(screen.getByLabelText("City")).toHaveValue("");
    expect(screen.getByLabelText("Start Date")).toHaveValue("");
    expect(screen.getByLabelText("End Date")).toHaveValue("");
  });

  it("applies correct styling classes", async () => {
    render(await TripPlanner({ searchParams: {} }));

    // Check main container
    const mainContainer = screen.getByTestId("trip-planner-container");
    expect(mainContainer).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "m-10",
      "w-3/4",
      "bg-trip-brown-100",
      "rounded-xl",
      "p-8",
      "font-trip-main"
    );

    // Check form
    const form = screen.getByRole("form");
    expect(form).toHaveClass(
      "flex",
      "flex-col",
      "w-11/12",
      "items-stretch",
      "w-full",
      "text-3xl",
      "font-trip-main"
    );

    // Check submit button
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toHaveClass(
      "bg-trip-blue-200",
      "w-1/5",
      "justify-center",
      "mt-5",
      "items-center",
      "text-trip-brown-100",
      "px-16",
      "py-2",
      "rounded-full",
      "font-semibold",
      "hover:scale-105",
      "hover:bg-trip-blue-200",
      "transition"
    );
  });

  it("includes hidden edit_id field when in edit mode", async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    });

    render(await TripPlanner({ searchParams: { edit: "trip1" } }));

    const hiddenInput = screen.getByTestId("edit-id-input");
    expect(hiddenInput).toHaveAttribute("name", "edit_id");
    expect(hiddenInput).toHaveAttribute("value", "trip1");
  });
}); 