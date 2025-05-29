import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExplorePage from "@/app/explore/page";

// Mock google.maps.Size globally (with @ts-ignore)
beforeAll(() => {
  // @ts-ignore
  globalThis.google = {
    maps: {
      Size: function (
        this: any,
        width: number,
        height: number,
        widthUnit?: string,
        heightUnit?: string,
      ) {
        this.width = width;
        this.height = height;
        this.equals = () => true;
      } as unknown as typeof google.maps.Size,
      DirectionsService: jest.fn(() => ({
        route: jest.fn(),
      })) as unknown as typeof google.maps.DirectionsService,
      TravelMode: { DRIVING: "DRIVING" }, // Mock necessary enum
      DirectionsStatus: { OK: "OK" }, // Mock necessary enum
    } as unknown as typeof google.maps,
  };
});

// Patch useState to return 1 marker for this test only
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useState: jest.fn((initial: any) => {
      if (Array.isArray(initial)) {
        return [
          [
            {
              id: 1,
              name: "Test Marker",
              position: { lat: 0, lng: 0 },
              selected: false,
            },
          ],
          jest.fn(),
        ];
      }
      return [initial, jest.fn()];
    }),
  };
});

describe("ExplorePage", () => {
  it("renders the Google Map", () => {
    render(<ExplorePage />);
    const mapElement = screen.getByTestId("google-map");
    expect(mapElement).toBeInTheDocument();
  });

  it("renders exactly one marker", () => {
    render(<ExplorePage />);
    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(1);
  });

  it("renders exactly two markers", () => {
    // Override useState for this specific test
    (React.useState as jest.Mock).mockImplementationOnce((initial: any) => {
      if (Array.isArray(initial)) {
        return [
          [
            {
              id: 1,
              name: "Test Marker 1",
              position: { lat: 0, lng: 0 },
              selected: false,
            },
            {
              id: 2,
              name: "Test Marker 2",
              position: { lat: 1, lng: 1 },
              selected: false,
            },
          ],
          jest.fn(),
        ];
      }
      return [initial, jest.fn()];
    });

    render(<ExplorePage />);
    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);
  });

  it("calculates distance between two selected markers", () => {
    // Mock useState to return two selected markers with specific coordinates
    (React.useState as jest.Mock).mockImplementationOnce((initial: any) => {
      if (Array.isArray(initial)) {
        const markers = [
          {
            id: 1,
            name: "Marker 1",
            position: { lat: 34.086055, lng: -117.278944 },
            selected: true,
          },
          {
            id: 2,
            name: "Marker 2",
            position: { lat: 33.900556, lng: -117.575694 },
            selected: true,
          },
        ];
        return [markers, jest.fn()];
      }
      return [initial, jest.fn()];
    });

    render(<ExplorePage />);

    // Find the calculate route button by its text content
    const calculateButton = screen.getByText("Calculate Route");
    fireEvent.click(calculateButton);

    // Get the mocked DirectionsService instance and its route method
    const mockDirectionsService = (google.maps.DirectionsService as jest.Mock)
      .mock.instances[0];
    const mockRoute = mockDirectionsService.route as jest.Mock;

    // Assert that the route method was called with the correct parameters
    expect(mockRoute).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: { lat: 34.086055, lng: -117.278944 },
        destination: { lat: 33.900556, lng: -117.575694 },
        waypoints: [], // Assuming no waypoints for two markers
        travelMode: "DRIVING",
      }),
      expect.any(Function),
    );
  });
});
