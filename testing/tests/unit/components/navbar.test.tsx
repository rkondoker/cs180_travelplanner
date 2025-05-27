import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";

// Mock the dependencies
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  signOutAction: jest.fn(),
}));

jest.mock("@/utils/supabase/check-env-vars", () => ({
  hasEnvVars: true,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navigation links when user is logged in", async () => {
    // Mock authenticated user
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
      },
    });

    render(await Navbar());

    // Check for TripWise logo
    expect(screen.getByText("TripWise")).toBeInTheDocument();

    // Check for navigation links
    expect(screen.getByText("Trip Planner")).toBeInTheDocument();
    expect(screen.getByText("My Trips")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("renders navigation links when user is logged out", async () => {
    // Mock unauthenticated user
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: null },
          }),
      },
    });

    render(await Navbar());

    // Check for TripWise logo
    expect(screen.getByText("TripWise")).toBeInTheDocument();

    // Check for navigation links
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders error message when environment variables are missing", async () => {
    // Mock missing environment variables
    jest.mock("@/utils/supabase/check-env-vars", () => ({
      hasEnvVars: false,
    }));

    render(await Navbar());

    expect(
      screen.getByText("You are missing the keys in your .env.local file"),
    ).toBeInTheDocument();
  });

  it("calls signOutAction when sign out button is clicked", async () => {
    // Mock authenticated user
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
      },
    });

    render(await Navbar());

    // Click sign out button
    fireEvent.click(screen.getByText("Sign out"));

    // Verify signOutAction was called
    expect(signOutAction).toHaveBeenCalled();
  });

  it("has correct href attributes for navigation links", async () => {
    // Mock authenticated user
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
      },
    });

    render(await Navbar());

    // Check href attributes
    expect(screen.getByText("TripWise").closest("a")).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText("Trip Planner").closest("a")).toHaveAttribute(
      "href",
      "/trip-planner",
    );
    expect(screen.getByText("My Trips").closest("a")).toHaveAttribute(
      "href",
      "/my-trips",
    );
    expect(screen.getByText("Explore").closest("a")).toHaveAttribute(
      "href",
      "/explore",
    );
  });
});
