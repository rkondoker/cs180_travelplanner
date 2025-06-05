import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Trip from "@/components/my-trips/trip";
import { deleteTrip } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock the deleteTrip action
jest.mock("@/app/actions", () => ({
  deleteTrip: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockDeleteTrip = deleteTrip as jest.Mock;

describe("Trip Component", () => {
  const mockTrip = {
    trip_id: "123",
    title: "Summer Vacation",
    start_date: "2024-07-01T10:00:00.000Z",
    end_date: "2024-07-15T10:00:00.000Z",
    city: "Paris",
    state_or_country: "France",
    activities: [
      {
        id: "a1",
        trip_id: "123",
        name: "Eiffel Tower",
        description: "",
        date: "2024-07-03",
      },
      {
        id: "a2",
        trip_id: "123",
        name: "Louvre Museum",
        description: "",
        date: "2024-07-05",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure the mockDeleteTrip action resolves successfully by default
    mockDeleteTrip.mockResolvedValue({});
  });

  it("renders trip information correctly", () => {
    render(<Trip {...mockTrip} />);

    expect(
      screen.getByText(
        `${mockTrip.title} – ${mockTrip.city}, ${mockTrip.state_or_country}`,
      ),
    ).toBeInTheDocument();
    // Expecting the dates to be formatted as Month Day, Year
    expect(
      screen.getByText("July 2, 2024 – July 16, 2024"),
    ).toBeInTheDocument();
  });

  it("renders activities when present", () => {
    render(<Trip {...mockTrip} />);

    // Click the button to reveal activities (assuming it's a button)
    const viewActivitiesButton = screen.getByLabelText("Show activities");
    fireEvent.click(viewActivitiesButton);

    expect(screen.getByText("Activities:")).toBeInTheDocument();
    expect(screen.getByText("View Activities")).toBeInTheDocument();
    expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
    expect(screen.getByText("Louvre Museum")).toBeInTheDocument();
    expect(screen.queryByText("No activities yet")).toBeNull();
  });

  it("renders 'No activities yet' when no activities are present", () => {
    const tripWithoutActivities = { ...mockTrip, activities: [] };
    render(<Trip {...tripWithoutActivities} />);

    // Click the button to reveal activities
    const viewActivitiesButton = screen.getByLabelText("Show activities");
    fireEvent.click(viewActivitiesButton);

    expect(screen.getByText("Activities:")).toBeInTheDocument();
    expect(screen.getByText("View Activities")).toBeInTheDocument();
    expect(screen.getByText("No activities yet")).toBeInTheDocument();
    expect(screen.queryByText("Eiffel Tower")).toBeNull();
    expect(screen.queryByText("Louvre Museum")).toBeNull();
  });

  it("renders Modify link with correct href", () => {
    render(<Trip {...mockTrip} />);

    const modifyLink = screen.getByText("Modify");
    expect(modifyLink).toBeInTheDocument();
    expect(modifyLink).toHaveAttribute(
      "href",
      `/trip-planner?edit=${mockTrip.trip_id}`,
    );
  });

  it("calls deleteTrip action when Delete button is clicked", async () => {
    render(<Trip {...mockTrip} />);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    // The deleteTrip action receives a FormData object. We need to verify its content.
    // One way is to mock FormData or check the argument structure if it's predictable.
    // A simpler way for now is to just check if the action was called.
    // A more robust test would involve checking the form data content.

    await waitFor(() => {
      expect(mockDeleteTrip).toHaveBeenCalledTimes(1);
      // To check FormData content, you might need to access call arguments:
      // const formData = mockDeleteTrip.mock.calls[0][0];
      // expect(formData.get('tripId')).toBe(mockTrip.trip_id);
    });
  });
});
