import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";
// Import hasEnvVars for type checking if needed, but not for direct assignment
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));
jest.mock("@/app/actions", () => ({
  signOutAction: jest.fn(),
}));

// Mock hasEnvVars to be mutable
const mockEnvVars = {
  _hasEnvVarsValue: true, // Internal variable
  get hasEnvVars() {
    return this._hasEnvVarsValue;
  },
  set hasEnvVars(value: boolean) {
    this._hasEnvVarsValue = value;
  },
};

jest.mock("@/utils/supabase/check-env-vars", () => mockEnvVars);

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockCreateClient = createClient as jest.Mock;
const mockSignOutAction = signOutAction as jest.Mock;

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default mock user state to logged out
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      },
    });
    // Set default hasEnvVars to true using the mock object
    mockEnvVars.hasEnvVars = true;
  });

  it("renders logged out navigation links when no user is logged in", async () => {
    render(await Navbar());

    expect(screen.getByText("TripWise")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toHaveAttribute("href", "/explore");
    expect(screen.getByText("Sign In")).toHaveAttribute("href", "/sign-in");
    expect(screen.getByText("Sign Up")).toHaveAttribute("href", "/sign-up");
    expect(screen.getByText("About Us")).toHaveAttribute("href", "/about");
    expect(screen.queryByText("Sign out")).toBeNull();
    expect(screen.queryByText("Trip Planner")).toBeNull();
    expect(screen.queryByText("My Trips")).toBeNull();
    expect(screen.queryByText("Activities")).toBeNull();
  });

  it("renders logged in navigation links when a user is logged in", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: "123" } } }),
      },
    });

    render(await Navbar());

    expect(screen.getByText("TripWise")).toBeInTheDocument();
    expect(screen.getByText("Trip Planner")).toHaveAttribute(
      "href",
      "/trip-planner",
    );
    expect(screen.getByText("My Trips")).toHaveAttribute("href", "/my-trips");
    expect(screen.getByText("Activities")).toHaveAttribute(
      "href",
      "/account/activities",
    );
    expect(screen.getByText("Sign out")).toBeInTheDocument();
    expect(screen.queryByText("Explore")).toBeNull();
    expect(screen.queryByText("Sign In")).toBeNull();
    expect(screen.queryByText("Sign Up")).toBeNull();
    expect(screen.queryByText("About Us")).toBeNull();
  });

  it("calls signOutAction when Sign out button is clicked", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: "123" } } }),
      },
    });

    render(await Navbar());

    const signOutButton = screen.getByText("Sign out");
    fireEvent.click(signOutButton);

    expect(mockSignOutAction).toHaveBeenCalledTimes(1);
  });

  it("renders an error message when environment variables are missing", async () => {
    // Explicitly set hasEnvVars to false for this test using the mock object
    mockEnvVars.hasEnvVars = false;

    render(await Navbar());

    expect(
      screen.getByText("You are missing the keys in your .env.local file"),
    ).toBeInTheDocument();
    expect(screen.queryByText("TripWise")).toBeNull(); // Ensure normal navbar is not rendered
  });
});
