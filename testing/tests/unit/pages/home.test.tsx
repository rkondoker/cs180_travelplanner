import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import teamMembers from "@/app/data/Members/members";

// Mock the Image component from next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("Home Page", () => {
  it("renders the main heading and description", async () => {
    render(await Home());

    // Check main heading
    expect(screen.getByText("Welcome to TripWise!")).toBeInTheDocument();

    // Check description text
    expect(
      screen.getByText(/Plan your perfect trip with recommendations/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Scroll down to learn more about our team/),
    ).toBeInTheDocument();
  });

  it("renders navigation links correctly", async () => {
    render(await Home());

    // Check login and signup links
    const loginLink = screen.getByText("Log In");
    const signupLink = screen.getByText("Sign Up");

    expect(loginLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();

    // Check href attributes
    expect(loginLink.closest("a")).toHaveAttribute("href", "/sign-in");
    expect(signupLink.closest("a")).toHaveAttribute("href", "/sign-up");
  });

  it("renders team members section correctly", async () => {
    render(await Home());

    // Check section heading
    expect(screen.getByText("Meet Our Team")).toBeInTheDocument();

    // Check if all team members are rendered
    teamMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
    });
  });

  it("renders story section correctly", async () => {
    render(await Home());

    // Check section heading
    expect(screen.getByText("Our Story:")).toBeInTheDocument();

    // Check story content
    expect(
      screen.getByText(/TripWise was born from a simple observation/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We believe that everyone deserves to experience/),
    ).toBeInTheDocument();
  });

  it("renders team member images", async () => {
    render(await Home());

    // Check if all team member images are rendered
    teamMembers.forEach((member) => {
      const image = screen.getByAltText(member.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", member.image);
    });
  });

  it("has correct styling classes", async () => {
    render(await Home());

    // Check main container classes
    const mainContainer = screen
      .getByText("Welcome to TripWise!")
      .closest("div");
    expect(mainContainer).toHaveClass("min-h-screen");

    // Check button styling
    const loginButton = screen.getByText("Log In").closest("a");
    expect(loginButton).toHaveClass("bg-blue-500");
    expect(loginButton).toHaveClass("hover:bg-green-600");
  });
});
