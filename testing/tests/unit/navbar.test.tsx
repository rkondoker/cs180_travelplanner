import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";

// Mock the supabase client and auth
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mock the signOutAction
jest.mock("@/app/actions", () => ({
  signOutAction: jest.fn(),
}));

// Mock the environment variables check
jest.mock("@/utils/supabase/check-env-vars", () => ({
  hasEnvVars: true,
}));

describe("Navbar", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("renders authenticated navbar with user links", async () => {
    // Mock authenticated user
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: {
              user: { id: "123", email: "test@example.com" },
            },
          }),
      },
    });

    render(await Navbar());

    // Check for authenticated user elements
    expect(screen.getByText("TripWise")).toBeInTheDocument();
    expect(screen.getByText("Trip Planner")).toBeInTheDocument();
    expect(screen.getByText("My Trips")).toBeInTheDocument();
    expect(screen.getByText("Activities")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();

    // Verify links are present
    expect(screen.getByText("Trip Planner").closest("a")).toHaveAttribute(
      "href",
      "/trip-planner",
    );
    expect(screen.getByText("My Trips").closest("a")).toHaveAttribute(
      "href",
      "/my-trips",
    );
    expect(screen.getByText("Activities").closest("a")).toHaveAttribute(
      "href",
      "/account/activities",
    );
  });

  it("renders unauthenticated navbar with public links", async () => {
    // Mock unauthenticated user
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: {
              user: null,
            },
          }),
      },
    });

    render(await Navbar());

    // Check for unauthenticated user elements
    expect(screen.getByText("TripWise")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();

    // Verify links are present
    expect(screen.getByText("Explore").closest("a")).toHaveAttribute(
      "href",
      "/explore",
    );
    expect(screen.getByText("Sign In").closest("a")).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(screen.getByText("Sign Up").closest("a")).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.getByText("About Us").closest("a")).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("renders error message when environment variables are missing", async () => {
    // Override the environment variables mock for this test only
    jest.requireMock("@/utils/supabase/check-env-vars").hasEnvVars = false;

    render(await Navbar());

    expect(
      screen.getByText("You are missing the keys in your .env.local file"),
    ).toBeInTheDocument();
  });
});
