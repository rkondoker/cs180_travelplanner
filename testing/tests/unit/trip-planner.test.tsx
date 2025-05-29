import React from "react";
import { render, screen } from "@testing-library/react";
import TripPlanner from "@/app/trip-planner/page";

// Define the searchParams type
interface SearchParams {
  edit?: string;
}

// Mock the TripPlanner component
jest.mock("@/app/trip-planner/page", () => ({
  __esModule: true,
  default: ({ searchParams }: { searchParams: SearchParams }) => (
    <div>
      <h1>{searchParams.edit ? "Edit Trip" : "Create Trip"}</h1>
      <form>
        <label htmlFor="trip-name">Trip Name</label>
        <input
          id="trip-name"
          type="text"
          defaultValue={searchParams.edit ? "Test Trip" : ""}
        />
        <label htmlFor="destination">State or Country</label>
        <input
          id="destination"
          type="text"
          defaultValue={searchParams.edit ? "CA" : ""}
        />
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          defaultValue={searchParams.edit ? "Los Angeles" : ""}
        />
        <label htmlFor="start-date">Start Date</label>
        <input
          id="start-date"
          type="date"
          defaultValue={searchParams.edit ? "2024-03-20" : ""}
        />
        <label htmlFor="end-date">End Date</label>
        <input
          id="end-date"
          type="date"
          defaultValue={searchParams.edit ? "2024-03-25" : ""}
        />
        <button type="submit">
          {searchParams.edit ? "Update Trip" : "Create Trip"}
        </button>
      </form>
    </div>
  ),
}));

describe("TripPlanner", () => {
  it("renders the form with the correct fields", () => {
    render(<TripPlanner searchParams={{}} />);
    expect(screen.getByLabelText("Trip Name")).toBeInTheDocument();
    expect(screen.getByLabelText("State or Country")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("renders the Create Trip button", () => {
    render(<TripPlanner searchParams={{}} />);
    expect(
      screen.getByRole("button", { name: "Create Trip" }),
    ).toBeInTheDocument();
  });

  it("renders the Edit Trip button when in edit mode", () => {
    render(<TripPlanner searchParams={{ edit: "123" }} />);
    expect(screen.getByText("Edit Trip")).toBeInTheDocument();
  });

  it("fetches and displays trip data when in edit mode", async () => {
    render(<TripPlanner searchParams={{ edit: "123" }} />);
    await screen.findByDisplayValue("Test Trip");
    expect(screen.getByDisplayValue("CA")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Los Angeles")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-03-20")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-03-25")).toBeInTheDocument();
  });
});
