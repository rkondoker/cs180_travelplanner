import "@testing-library/jest-dom";
import React, { ReactNode } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";
import ExplorePage from "@/app/explore/page";
import { createClient } from "@/utils/supabase/server";

// Mock the Google Maps API
jest.mock("@react-google-maps/api", () => ({
  LoadScript: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GoogleMap: ({
    children,
    onLoad,
    onClick,
  }: {
    children: ReactNode;
    onLoad?: () => void;
    onClick?: () => void;
  }) => (
    <div data-testid="google-map" onClick={onClick}>
      {children}
    </div>
  ),
  Marker: ({
    position,
    onClick,
  }: {
    position: { lat: number; lng: number };
    onClick?: () => void;
  }) => (
    <div
      data-testid="marker"
      data-position={JSON.stringify(position)}
      onClick={onClick}
    />
  ),
  InfoWindow: ({
    position,
    children,
  }: {
    position: { lat: number; lng: number };
    children: ReactNode;
  }) => (
    <div data-testid="info-window" data-position={JSON.stringify(position)}>
      {children}
    </div>
  ),
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
  useJsApiLoader: () => ({
    isLoaded: true,
    loadError: null,
  }),
}));

// Mock the Places API
const mockPlacesService = {
  nearbySearch: jest.fn(),
  getDetails: jest.fn(),
};

// Mock the Directions Service
const mockDirectionsService = {
  route: jest.fn(),
};

describe("Explore Page", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the Places API
    global.google = {
      maps: {
        places: {
          PlacesService: jest.fn(() => mockPlacesService),
        },
        DirectionsService: jest.fn(() => mockDirectionsService),
        LatLng: jest.fn((lat, lng) => ({ lat, lng })),
        LatLngBounds: jest.fn(() => ({
          contains: jest.fn(() => true),
        })),
        Circle: jest.fn(() => ({
          setMap: jest.fn(),
          setCenter: jest.fn(),
          setRadius: jest.fn(),
        })),
      },
    } as any;
  });

  it("renders the map component", () => {
    render(<ExplorePage />);
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("creates a marker when clicking on the map", async () => {
    render(<ExplorePage />);

    // Mock the Places API response
    mockPlacesService.nearbySearch.mockResolvedValueOnce([
      {
        place_id: "123",
        name: "Test Place",
        geometry: {
          location: { lat: 37.7749, lng: -122.4194 },
        },
      },
    ]);

    mockPlacesService.getDetails.mockResolvedValueOnce({
      name: "Test Place",
      formatted_address: "123 Test St",
      formatted_phone_number: "123-456-7890",
      rating: 4.5,
      website: "https://test.com",
    });

    // Simulate map click
    fireEvent.click(screen.getByTestId("google-map"));

    // Wait for marker to be created
    await waitFor(() => {
      expect(screen.getByTestId("marker")).toBeInTheDocument();
    });
  });

  it("displays info window when clicking a marker", async () => {
    render(<ExplorePage />);

    // Create a marker first
    mockPlacesService.nearbySearch.mockResolvedValueOnce([
      {
        place_id: "123",
        name: "Test Place",
        geometry: {
          location: { lat: 37.7749, lng: -122.4194 },
        },
      },
    ]);

    mockPlacesService.getDetails.mockResolvedValueOnce({
      name: "Test Place",
      formatted_address: "123 Test St",
      formatted_phone_number: "123-456-7890",
      rating: 4.5,
      website: "https://test.com",
    });

    // Click map to create marker
    fireEvent.click(screen.getByTestId("google-map"));

    // Wait for marker to be created
    await waitFor(() => {
      expect(screen.getByTestId("marker")).toBeInTheDocument();
    });

    // Click marker to show info window
    fireEvent.click(screen.getByTestId("marker"));

    // Check if info window is displayed
    await waitFor(() => {
      expect(screen.getByTestId("info-window")).toBeInTheDocument();
    });
  });

  it("calculates route between selected markers", async () => {
    render(<ExplorePage />);

    // Mock directions service response
    mockDirectionsService.route.mockResolvedValueOnce({
      routes: [
        {
          legs: [
            {
              distance: { text: "5.2 km" },
              duration: { text: "15 mins" },
            },
          ],
        },
      ],
    });

    // Create two markers
    mockPlacesService.nearbySearch
      .mockResolvedValueOnce([
        {
          place_id: "123",
          name: "Start Place",
          geometry: { location: { lat: 37.7749, lng: -122.4194 } },
        },
      ])
      .mockResolvedValueOnce([
        {
          place_id: "456",
          name: "End Place",
          geometry: { location: { lat: 37.7848, lng: -122.4294 } },
        },
      ]);

    // Click map twice to create two markers
    fireEvent.click(screen.getByTestId("google-map"));
    fireEvent.click(screen.getByTestId("google-map"));

    // Select both markers
    const markers = screen.getAllByTestId("marker");
    fireEvent.click(markers[0]);
    fireEvent.click(markers[1]);

    // Click calculate route button
    fireEvent.click(screen.getByText("Calculate Route"));

    // Check if directions renderer is displayed
    await waitFor(() => {
      expect(screen.getByTestId("directions-renderer")).toBeInTheDocument();
    });
  });

  it("resets map when clicking reset button", async () => {
    render(<ExplorePage />);

    // Create a marker first
    mockPlacesService.nearbySearch.mockResolvedValueOnce([
      {
        place_id: "123",
        name: "Test Place",
        geometry: {
          location: { lat: 37.7749, lng: -122.4194 },
        },
      },
    ]);

    // Click map to create marker
    fireEvent.click(screen.getByTestId("google-map"));

    // Wait for marker to be created
    await waitFor(() => {
      expect(screen.getByTestId("marker")).toBeInTheDocument();
    });

    // Click reset button
    fireEvent.click(screen.getByText("Reset Map"));

    // Check if marker is removed
    await waitFor(() => {
      expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
    });
  });

  it("shows user location when clicking my location button", async () => {
    // Mock geolocation
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
        success({
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
        }),
      ),
      watchPosition: jest.fn(),
    };
    (global.navigator as any).geolocation = mockGeolocation;

    render(<ExplorePage />);

    // Click my location button
    fireEvent.click(screen.getByText("My Location"));

    // Check if user location marker is created
    await waitFor(() => {
      expect(screen.getByTestId("marker")).toBeInTheDocument();
    });
  });
});
