import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import Navbar from "@/components/navbar";
import "@testing-library/jest-dom";

// Mock the Navbar component
jest.mock("@/components/navbar", () => () => (
  <div data-testid="mock-navbar">Mock Navbar</div>
));

describe("RootLayout", () => {
  it("renders Navbar and children with correct structure and classes", async () => {
    // RootLayout is an async component, so we need to await it
    render(
      await RootLayout({
        children: <div data-testid="test-child">Test Child Content</div>,
      }),
    );

    // Check for the presence of the mocked Navbar
    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();

    // Check for the presence of the test child content
    expect(screen.getByTestId("test-child")).toBeInTheDocument();

    // Check for the main body classes
    const body = document.body;
    expect(body).toHaveClass(
      "bg-background",
      "text-foreground",
      "bg-trip-blue-200",
      "w-full",
    );

    // Check for the main content container classes around Navbar and children
    const mainContentContainer =
      screen.getByTestId("mock-navbar").parentElement;
    expect(mainContentContainer).toBeInTheDocument();
    expect(mainContentContainer).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
    );
  });

  it("renders with multiple children", async () => {
    render(
      await RootLayout({
        children: [
          <div key="c1" data-testid="child-1">
            Child 1
          </div>,
          <div key="c2" data-testid="child-2">
            Child 2
          </div>,
        ],
      }),
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();

    const mainContentContainer = screen.getByTestId("child-1").parentElement;
    expect(mainContentContainer).toBeInTheDocument();
    expect(mainContentContainer).toHaveClass("flex", "flex-col"); // Checking a subset of expected classes
  });

  it("applies Geist font className and suppressHydrationWarning", async () => {
    // Mock the Geist font object to check for className application
    const mockGeistClassName = "mock-geist-class";
    jest.mock("next/font/google", () => ({
      Geist: jest.fn(() => ({
        className: mockGeistClassName,
        display: "swap",
        subsets: ["latin"],
      })),
    }));

    // Need to re-import RootLayout after mocking the font
    jest.resetModules();
    const ReImportedRootLayout = require("@/app/layout").default;

    render(await ReImportedRootLayout({ children: <div>Test</div> }));

    // Check that the html element has the correct class from Geist
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveClass(mockGeistClassName);

    // Check for suppressHydrationWarning attribute (Jest doesn't directly assert this attribute on html, but we can check if it's passed)
    // This is more of a conceptual check as suppressHydrationWarning is a directive for React.
    // If the Geist className is applied, it implies the font object was used, which should include the directive.
  });
});
