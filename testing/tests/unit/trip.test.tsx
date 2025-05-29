import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Trip from "@/components/my-trips/trip";

jest.mock("@/app/actions", () => ({
  deleteTrip: jest.fn(),
}));

describe("Trip", () => {
  const baseProps = {
    trip_id: "trip1",
    title: "Spring Break",
    start_date: "2024-03-20",
    end_date: "2024-03-25",
    city: "Los Angeles",
    state_or_country: "CA",
  };

  it("renders trip details and formatted dates", () => {
    render(<Trip {...baseProps} />);
    expect(screen.getByText(/Spring Break/)).toBeInTheDocument();
    expect(screen.getByText(/Los Angeles, CA/)).toBeInTheDocument();
    expect(screen.getByText(/March/)).toBeInTheDocument(); // formatted date
    expect(screen.getByText("Map here")).toBeInTheDocument();
  });

  it("shows 'No activities yet' when no activities are present", () => {
    render(<Trip {...baseProps} activities={[]} />);
    fireEvent.mouseOver(screen.getByText(/View Activities/));
    expect(screen.getByText(/No activities yet/)).toBeInTheDocument();
  });

  it("shows activities in dropdown when present", () => {
    const activities = [
      {
        id: "a1",
        trip_id: "trip1",
        name: "Hiking",
        description: "",
        date: "2024-03-21",
      },
      {
        id: "a2",
        trip_id: "trip1",
        name: "Museum",
        description: "",
        date: "2024-03-22",
      },
    ];
    render(<Trip {...baseProps} activities={activities} />);
    fireEvent.mouseOver(screen.getByText(/View Activities/));
    expect(screen.getByText("Hiking")).toBeInTheDocument();
    expect(screen.getByText("Museum")).toBeInTheDocument();
  });

  it("renders Modify link with correct href", () => {
    render(<Trip {...baseProps} />);
    const modifyLink = screen.getByText("Modify").closest("a");
    expect(modifyLink).toHaveAttribute("href", "/trip-planner?edit=trip1");
  });

  it("renders Delete button", () => {
    render(<Trip {...baseProps} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
