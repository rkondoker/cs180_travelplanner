import { render, screen } from "@testing-library/react";
import AccountPage from "../../../app/account/page";
import { createClient } from "../../../utils/supabase/server";
import { handleWeather } from "../../../utils/weather/handleWeather";

// Mock the server actions and utilities
jest.mock("../../../utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("../../../utils/weather/handleWeather", () => ({
  handleWeather: jest.fn(),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Account Page", () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("redirects to sign-in when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    await AccountPage();
    expect(require("next/navigation").redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("displays error message when user details fetch fails", async () => {
    const errorMessage = "Failed to fetch user details";
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user123" } },
    });

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    (handleWeather as jest.Mock).mockResolvedValue({
      condition: "Sunny",
      temperature: 75,
      icon: "SunIcon",
    });

    render(await AccountPage());

    expect(screen.getByText(`Error fetching user details: ${errorMessage}`)).toBeInTheDocument();
  });

  it("displays user information and weather data", async () => {
    const mockUser = { id: "user123" };
    const mockUserInfo = {
      username: "testuser",
      joined_on: "2024-01-01T00:00:00.000Z",
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
    });

    mockSupabase.single.mockResolvedValue({
      data: mockUserInfo,
      error: null,
    });

    (handleWeather as jest.Mock).mockResolvedValue({
      condition: "Sunny",
      temperature: 75,
      icon: "SunIcon",
    });

    render(await AccountPage());

    // Check user information
    expect(screen.getByText(/Welcome,/)).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText(/Joined on:/)).toBeInTheDocument();
    expect(screen.getByText("1/1/2024")).toBeInTheDocument();

    // Check weather information
    expect(screen.getByText("Weather: Sunny")).toBeInTheDocument();
    expect(screen.getByText("Temperature: 75°F")).toBeInTheDocument();
    expect(screen.getByText("Location: Riverside, California")).toBeInTheDocument();
  });

  it("applies correct styling classes", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user123" } },
    });

    mockSupabase.single.mockResolvedValue({
      data: {
        username: "testuser",
        joined_on: "2024-01-01T00:00:00.000Z",
      },
      error: null,
    });

    (handleWeather as jest.Mock).mockResolvedValue({
      condition: "Sunny",
      temperature: 75,
      icon: "SunIcon",
    });

    render(await AccountPage());

    // Check main container
    const mainContainer = screen.getByRole("generic", { hidden: true });
    expect(mainContainer).toHaveClass(
      "min-h-screen",
      "flex",
      "items-center",
      "justify-center",
      "bg-trip-blue-100",
      "text-white",
      "p-6"
    );

    // Check content container
    const contentContainer = screen.getByRole("generic", { hidden: true }).querySelector(".bg-trip-brown-200");
    expect(contentContainer).toHaveClass(
      "bg-trip-brown-200",
      "text-white",
      "rounded-2xl",
      "shadow-lg",
      "p-8",
      "w-full",
      "max-w-md",
      "space-y-6"
    );

    // Check heading
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-2xl", "font-bold", "border-b", "pb-2");
  });
}); 