import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TripPlanner from "@/app/trip-planner/page";
import { createTripAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("@/app/actions", () => ({
  createTripAction: jest.fn(),
}));

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation - specifically redirect as it's used in auth checks
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockCreateTripAction = createTripAction as jest.Mock;
const mockCreateClient = createClient as jest.Mock;

describe("TripPlanner Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for createClient assuming a logged-in user and no trip data for edit
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }), // Default: no trip found for edit
      })),
    });

    // Default mock for createTripAction to resolve immediately
    mockCreateTripAction.mockResolvedValue({});
  });

  it("renders in Create Trip mode by default", async () => {
    render(await TripPlanner({ searchParams: {} }));

    expect(screen.getByText("Create Trip")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Trip" }),
    ).toBeInTheDocument();

    // Check for required input fields
    expect(screen.getByLabelText("Trip Name")).toBeRequired();
    expect(screen.getByLabelText("State or Country")).toBeRequired();
    expect(screen.getByLabelText("City")).toBeRequired();
    expect(screen.getByLabelText("Start Date")).toBeRequired();
    expect(screen.getByLabelText("End Date")).toBeRequired();
  });

  it("renders in Edit Trip mode when edit search param is present and trip data is found", async () => {
    const mockTripData = {
      trip_id: "edit-456",
      title: "Edited Trip",
      state_or_country: "Canada",
      city: "Vancouver",
      start_date: "2025-01-10",
      end_date: "2025-01-20",
    };

    // Mock createClient to return trip data for edit mode
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: mockTripData, error: null }),
      })),
    });

    render(await TripPlanner({ searchParams: { edit: "edit-456" } }));

    expect(screen.getByText("Edit Trip")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update Trip" }),
    ).toBeInTheDocument();

    // Check that input fields are pre-filled with trip data
    expect(screen.getByLabelText("Trip Name")).toHaveValue(mockTripData.title);
    expect(screen.getByLabelText("State or Country")).toHaveValue(
      mockTripData.state_or_country,
    );
    expect(screen.getByLabelText("City")).toHaveValue(mockTripData.city);
    expect(screen.getByLabelText("Start Date")).toHaveValue(
      mockTripData.start_date,
    );
    expect(screen.getByLabelText("End Date")).toHaveValue(
      mockTripData.end_date,
    );

    // Check for hidden input with edit_id
    expect(screen.getByTestId("trip-planner-container")).toContainElement(
      screen.getByRole("textbox", { hidden: true, name: "edit_id" }),
    );
    expect(
      screen.getByRole("textbox", { hidden: true, name: "edit_id" }),
    ).toHaveValue("edit-456");
  });

  it("falls back to Create Trip mode if edit search param is present but trip data is not found", async () => {
    // Default mock already returns null for trip data
    render(await TripPlanner({ searchParams: { edit: "non-existent-id" } }));

    // Should render in Create Trip mode
    expect(screen.getByText("Create Trip")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Trip" }),
    ).toBeInTheDocument();

    // Check that input fields are empty
    expect(screen.getByLabelText("Trip Name")).toHaveValue("");
    expect(screen.getByLabelText("State or Country")).toHaveValue("");
    expect(screen.getByLabelText("City")).toHaveValue("");
    expect(screen.getByLabelText("Start Date")).toHaveValue("");
    expect(screen.getByLabelText("End Date")).toHaveValue("");

    // Hidden input for edit_id should not be present
    expect(
      screen.queryByRole("textbox", { hidden: true, name: "edit_id" }),
    ).toBeNull();
  });

  it("calls createTripAction with form data on submit in Create mode", async () => {
    render(await TripPlanner({ searchParams: {} }));

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Trip Name"), {
      target: { value: "New Trip" },
    });
    fireEvent.change(screen.getByLabelText("State or Country"), {
      target: { value: "USA" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "NY" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2024-08-01" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2024-08-10" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Create Trip" }));

    // Check if createTripAction was called with FormData
    await waitFor(() => {
      expect(mockCreateTripAction).toHaveBeenCalledTimes(1);
      const formData = mockCreateTripAction.mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("trip-name")).toBe("New Trip");
      expect(formData.get("destination")).toBe("USA");
      expect(formData.get("city")).toBe("NY");
      expect(formData.get("start-date")).toBe("2024-08-01");
      expect(formData.get("end-date")).toBe("2024-08-10");
      expect(formData.has("edit_id")).toBe(false);
    });
  });

  it("calls createTripAction with form data including edit_id on submit in Edit mode", async () => {
    const mockTripData = {
      trip_id: "edit-789",
      title: "Original Title",
      state_or_country: "Mexico",
      city: "Cancun",
      start_date: "2024-09-01",
      end_date: "2024-09-15",
    };

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: mockTripData, error: null }),
      })),
    });

    render(await TripPlanner({ searchParams: { edit: "edit-789" } }));

    // Change some fields
    fireEvent.change(screen.getByLabelText("Trip Name"), {
      target: { value: "Updated Trip Title" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Update Trip" }));

    await waitFor(() => {
      expect(mockCreateTripAction).toHaveBeenCalledTimes(1);
      const formData = mockCreateTripAction.mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("trip-name")).toBe("Updated Trip Title");
      // Check that other fields retain their original values if not changed
      expect(formData.get("destination")).toBe("Mexico");
      expect(formData.get("city")).toBe("Cancun");
      expect(formData.get("start-date")).toBe("2024-09-01");
      expect(formData.get("end-date")).toBe("2024-09-15");
      // Check that the edit_id is included
      expect(formData.get("edit_id")).toBe("edit-789");
    });
  });

  it("shows creating trip pending text when creating", async () => {
    // Mock action to be pending
    mockCreateTripAction.mockImplementation(() => new Promise(() => {}));

    render(await TripPlanner({ searchParams: {} }));

    // Fill out required fields to enable submit button (assuming required attribute handles this)
    fireEvent.change(screen.getByLabelText("Trip Name"), {
      target: { value: "New Trip" },
    });
    fireEvent.change(screen.getByLabelText("State or Country"), {
      target: { value: "USA" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "NY" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2024-08-01" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2024-08-10" },
    });

    // Submit the form to trigger pending state
    fireEvent.click(screen.getByRole("button", { name: "Create Trip" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Creating Trip..." }),
      ).toBeInTheDocument();
    });
  });

  it("shows updating trip pending text when editing", async () => {
    const mockTripData = {
      trip_id: "edit-999",
      title: "Pending Edit",
      state_or_country: "UK",
      city: "London",
      start_date: "2025-10-01",
      end_date: "2025-10-10",
    };

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: "user-123" } } }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: mockTripData, error: null }),
      })),
    });

    // Mock action to be pending
    mockCreateTripAction.mockImplementation(() => new Promise(() => {}));

    render(await TripPlanner({ searchParams: { edit: "edit-999" } }));

    // Fill out required fields (already pre-filled in edit mode, but fireEvent might be needed for changes)
    fireEvent.change(screen.getByLabelText("Trip Name"), {
      target: { value: "Pending Edit Updated" },
    });

    // Submit the form to trigger pending state
    fireEvent.click(screen.getByRole("button", { name: "Update Trip" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Updating Trip..." }),
      ).toBeInTheDocument();
    });
  });

  it("renders correct styling classes", async () => {
    render(await TripPlanner({ searchParams: {} }));

    const container = screen.getByTestId("trip-planner-container");
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "m-10",
      "w-3/4",
      "bg-trip-brown-100",
      "rounded-xl",
      "p-8",
      "font-trip-main",
    );

    const form = screen.getByRole("form", { hidden: true }); // Form is hidden by default in testing-library
    expect(form).toHaveClass(
      "flex",
      "flex-col",
      "w-11/12",
      "items-stretch",
      "w-full",
      "text-3xl",
      "font-trip-main",
    );
  });
});
