import "@testing-library/jest-dom";

// Mock Google Maps
jest.mock("@react-google-maps/api", () => ({
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  LoadScript: ({ children }) => <div>{children}</div>,
  Marker: () => <div data-testid="marker" />,
  InfoWindow: () => <div data-testid="info-window" />,
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
}));

// Mock Supabase
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  })),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
