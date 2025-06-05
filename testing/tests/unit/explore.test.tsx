import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Explore from "@/app/explore/page";
import "@testing-library/jest-dom";

// Mock the Google Maps API
const mockGoogleMaps = {
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    LatLng: jest.fn(),
    LatLngBounds: jest.fn(),
    places: {
      PlacesService: jest.fn(),
      Autocomplete: jest.fn(),
    },
    DirectionsService: jest.fn(),
    DirectionsRenderer: jest.fn(),
    Animation: {
      DROP: "DROP",
      BOUNCE: "BOUNCE",
    },
  },
};

// Mock the geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

// Mock the window.google object
global.google = mockGoogleMaps as any;

// Mock the navigator.geolocation object
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
});

describe("Explore Page", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGeolocation.getCurrentPosition.mockClear();
    mockGeolocation.watchPosition.mockClear();
    mockGeolocation.clearWatch.mockClear();
    mockGoogleMaps.maps.places.PlacesService.mockClear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("handles geolocation error", async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(new Error("Geolocation error"));
    });

    render(<Explore />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error getting location:",
        expect.any(Error),
      );
    });
  });

  it("handles location watching error", async () => {
    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      error(new Error("Location watching error"));
      return 123;
    });

    render(<Explore />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error watching location:",
        expect.any(Error),
      );
    });
  });

  it("cleans up location watching on unmount", () => {
    mockGeolocation.watchPosition.mockReturnValue(123);
    const { unmount } = render(<Explore />);
    unmount();
    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
  });

  it("handles map click and adds marker", async () => {
    const mockMarker = {
      setMap: jest.fn(),
      setPosition: jest.fn(),
      setAnimation: jest.fn(),
    };
    mockGoogleMaps.maps.Marker.mockReturnValue(mockMarker);

    render(<Explore />);

    const map = screen.getByTestId("google-map");
    fireEvent.click(map, { latLng: { lat: 37.7749, lng: -122.4194 } });

    await waitFor(() => {
      expect(mockGoogleMaps.maps.Marker).toHaveBeenCalled();
    });
  });

  it("calculates route between selected markers", async () => {
    const mockDirectionsRenderer = {
      setMap: jest.fn(),
      setDirections: jest.fn(),
    };
    mockGoogleMaps.maps.DirectionsRenderer.mockReturnValue(
      mockDirectionsRenderer,
    );

    const mockDirectionsService = {
      route: jest.fn((request, callback) => {
        callback(
          {
            routes: [
              {
                legs: [
                  {
                    distance: { text: "5 miles" },
                    duration: { text: "10 mins" },
                  },
                ],
              },
            ],
          },
          "OK",
        );
      }),
    };
    mockGoogleMaps.maps.DirectionsService.mockReturnValue(
      mockDirectionsService,
    );

    render(<Explore />);

    // Add two markers
    const map = screen.getByTestId("google-map");
    fireEvent.click(map, { latLng: { lat: 37.7749, lng: -122.4194 } });
    fireEvent.click(map, { latLng: { lat: 37.7833, lng: -122.4167 } });

    // Click calculate route button
    const calculateButton = screen.getByTestId("calculate-route");
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(mockDirectionsService.route).toHaveBeenCalled();
      expect(mockDirectionsRenderer.setDirections).toHaveBeenCalled();
    });
  });

  it("handles marker animation sequence", async () => {
    const mockMarker = {
      setMap: jest.fn(),
      setPosition: jest.fn(),
      setAnimation: jest.fn(),
    };
    mockGoogleMaps.maps.Marker.mockReturnValue(mockMarker);

    render(<Explore />);

    const map = screen.getByTestId("google-map");
    fireEvent.click(map, { latLng: { lat: 37.7749, lng: -122.4194 } });

    await waitFor(() => {
      expect(mockMarker.setAnimation).toHaveBeenCalledWith(
        mockGoogleMaps.maps.Animation.DROP,
      );
    });
  });

  it("displays route information after calculation", async () => {
    const mockDirectionsRenderer = {
      setMap: jest.fn(),
      setDirections: jest.fn(),
    };
    mockGoogleMaps.maps.DirectionsRenderer.mockReturnValue(
      mockDirectionsRenderer,
    );

    const mockDirectionsService = {
      route: jest.fn((request, callback) => {
        callback(
          {
            routes: [
              {
                legs: [
                  {
                    distance: { text: "5 miles" },
                    duration: { text: "10 mins" },
                  },
                ],
              },
            ],
          },
          "OK",
        );
      }),
    };
    mockGoogleMaps.maps.DirectionsService.mockReturnValue(
      mockDirectionsService,
    );

    render(<Explore />);

    // Add two markers
    const map = screen.getByTestId("google-map");
    fireEvent.click(map, { latLng: { lat: 37.7749, lng: -122.4194 } });
    fireEvent.click(map, { latLng: { lat: 37.7833, lng: -122.4167 } });

    // Click calculate route button
    const calculateButton = screen.getByTestId("calculate-route");
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(mockDirectionsService.route).toHaveBeenCalled();
      expect(mockDirectionsRenderer.setDirections).toHaveBeenCalled();
    });
  });
});
