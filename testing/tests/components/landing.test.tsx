import React from "react";
import { render, screen } from "@testing-library/react";
import LandingPage from "@/components/landing";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("LandingPage", () => {
  it("renders welcome message", () => {
    render(<LandingPage />);
    expect(screen.getByText("Welcome to TripWise!")).toBeInTheDocument();
  });

  it("renders Log In and Sign Up links", () => {
    render(<LandingPage />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders background images", () => {
    render(<LandingPage />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });
});
