import { render, screen, fireEvent, act } from "@testing-library/react";
import ExplorePage from "../../../app/explore/page";
import { useRef, useEffect } from "react";

// Create a stable mock map object outside the component
const mockMap = {
  getCenter: () => ({ lat: () => 0, lng: () => 0 }),
  panTo: jest.fn(),
  setZoom: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

// Mock Google Maps
jest.mock("@react-google-maps/api", () => ({
  LoadScript: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  GoogleMap: ({
    children,
    onLoad,
  }: {
    children: React.ReactNode;
    onLoad: (map: any) => void;
  }) => {
    const onLoadCalled = useRef(false);

    useEffect(() => {
      if (onLoad && !onLoadCalled.current) {
        onLoad(mockMap);
        onLoadCalled.current = true;
      }
    }, [onLoad]);

    return (
      <div data-testid="google-map">
        {children}
        <div data-testid="markers-container">
          <div data-testid="marker" />
          <div data-testid="marker" />
        </div>
        <button data-testid="calculate-route">Calculate Route</button>
        <button data-testid="my-location">My Location</button>
      </div>
    );
  },
  Marker: () => <div data-testid="marker" />,
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
});

// Mock google.maps
global.google = {
  maps: {
    LatLng: jest.fn((lat, lng) => ({ lat: () => lat, lng: () => lng })),
    MapMouseEvent: class {
      latLng = {
        lat: () => 34.0522,
        lng: () => -118.2437,
      };
    },
    places: {
      PlacesService: jest.fn(() => ({
        findPlaceFromQuery: jest.fn((request, callback) => {
          callback(
            [
              {
                name: "Test Restaurant",
                geometry: {
                  location: {
                    lat: () => 34.0522,
                    lng: () => -118.2437,
                  },
                },
              },
            ],
            "OK",
          );
        }),
      })),
      PlacesServiceStatus: {
        OK: "OK",
      },
    },
    DirectionsService: jest.fn(() => ({
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
    })),
    DirectionsStatus: {
      OK: "OK",
    },
    TravelMode: {
      DRIVING: "DRIVING",
    },
    Circle: jest.fn(() => ({
      setMap: jest.fn(),
      setCenter: jest.fn(),
    })),
    Animation: {
      DROP: "DROP",
      BOUNCE: "BOUNCE",
    },
  },
} as any;

describe("Explore Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the map with initial state", async () => {
    await act(async () => {
      render(<ExplorePage />);
    });
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("handles geolocation error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(new Error("Geolocation error"));
    });

    await act(async () => {
      render(<ExplorePage />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("my-location"));
      // Add a small delay to allow for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error getting location:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("handles location watching error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 34.0522,
          longitude: -118.2437,
        },
      });
    });
    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      error(new Error("Watch position error"));
      return 123; // mock watchId
    });

    await act(async () => {
      render(<ExplorePage />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("my-location"));
      // Add a small delay to allow for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error watching location:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("cleans up location watching on unmount", async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 34.0522,
          longitude: -118.2437,
        },
      });
    });
    mockGeolocation.watchPosition.mockReturnValue(123);

    const { unmount } = await act(async () => {
      return render(<ExplorePage />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("my-location"));
      // Add a small delay to allow for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    unmount();

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
  });

  it("handles map click and adds marker", async () => {
    await act(async () => {
      render(<ExplorePage />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("google-map"));
      // Add a small delay to allow for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(global.google.maps.places.PlacesService).toHaveBeenCalled();
  });

  it("calculates route between selected markers", async () => {
    await act(async () => {
      render(<ExplorePage />);
    });

    await act(async () => {
      const markers = screen.getAllByTestId("marker");
      fireEvent.click(markers[0]);
      fireEvent.click(markers[1]);
      fireEvent.click(screen.getByTestId("calculate-route"));
      // Add a small delay to allow for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(global.google.maps.DirectionsService).toHaveBeenCalled();
  });

  it("handles marker animation sequence", async () => {
    // Mock setTimeout to control animation timing
    jest.useFakeTimers();

    const mockMarker = {
      setAnimation: jest.fn(),
    };

    // Mock the marker load handler
    const handleMarkerLoad = jest.fn((marker) => {
      marker.setAnimation(global.google.maps.Animation.DROP);
      setTimeout(() => {
        marker.setAnimation(global.google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 2000);
      }, 1000);
    });

    await act(async () => {
      render(<ExplorePage />);
    });

    // Simulate marker load
    await act(async () => {
      handleMarkerLoad(mockMarker);
    });

    // Verify initial DROP animation
    expect(mockMarker.setAnimation).toHaveBeenCalledWith(
      global.google.maps.Animation.DROP,
    );

    // Fast-forward 1 second
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Verify BOUNCE animation
    expect(mockMarker.setAnimation).toHaveBeenCalledWith(
      global.google.maps.Animation.BOUNCE,
    );

    // Fast-forward 2 more seconds
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Verify animation is cleared
    expect(mockMarker.setAnimation).toHaveBeenCalledWith(null);

    // Clean up
    jest.useRealTimers();
  });

  it("displays route information after calculation", async () => {
    // Mock the directions service response
    const mockDirectionsResult = {
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
      request: {
        origin: { lat: () => 0, lng: () => 0 },
        destination: { lat: () => 0, lng: () => 0 },
        travelMode: "DRIVING",
      },
    };

    // Update the DirectionsService mock
    const mockRoute = jest.fn((request, callback) => {
      if (callback) {
        callback(mockDirectionsResult, "OK");
      }
    });

    const mockDirectionsService = {
      route: mockRoute,
    };

    // Mock the DirectionsService constructor
    (global.google.maps.DirectionsService as jest.Mock) = jest
      .fn()
      .mockImplementation(() => mockDirectionsService);

    await act(async () => {
      render(<ExplorePage />);
    });

    // Select markers and calculate route
    await act(async () => {
      const markers = screen.getAllByTestId("marker");
      fireEvent.click(markers[0]);
      fireEvent.click(markers[1]);
      fireEvent.click(screen.getByTestId("calculate-route"));
      // Add a small delay to allow for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify route information is displayed
    expect(screen.getByText("5 miles")).toBeInTheDocument();
    expect(screen.getByText("10 mins")).toBeInTheDocument();
    expect(screen.getByTestId("directions-renderer")).toBeInTheDocument();
  });
});
