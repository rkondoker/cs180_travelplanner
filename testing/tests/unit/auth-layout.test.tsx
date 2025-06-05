import { render, screen } from "@testing-library/react";
import Layout from "@/app/(auth-pages)/layout";
import "@testing-library/jest-dom";

describe("Auth Layout", () => {
  it("renders children with correct layout classes", () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>,
    );

    // Check main container
    const container = screen.getByTestId("test-child").parentElement;
    expect(container).toHaveClass(
      "max-w-7xl",
      "flex",
      "flex-col",
      "gap-12",
      "items-start",
    );
  });

  it("renders multiple children with correct spacing", () => {
    render(
      <Layout>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </Layout>,
    );

    // Check that both children are rendered
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();

    // Check that the gap class is applied
    const container = screen.getByTestId("child-1").parentElement;
    expect(container).toHaveClass("gap-12");
  });

  it("maintains layout structure with complex children", () => {
    render(
      <Layout>
        <div className="p-4 bg-white">
          <h1>Header</h1>
          <p>Content</p>
        </div>
        <div className="p-4 bg-gray-100">
          <h2>Footer</h2>
        </div>
      </Layout>,
    );

    // Check that the layout structure is maintained
    const container = screen.getByText("Header").closest(".max-w-7xl");
    expect(container).toBeInTheDocument();

    // Check that the flex column layout is maintained
    expect(container).toHaveClass("flex", "flex-col");
  });
});
