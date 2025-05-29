import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies default className", () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText("Default Card").parentElement;
    expect(card).toHaveClass("rounded-xl shadow-lg p-4 bg-white");
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Custom Card</Card>);
    const card = screen.getByText("Custom Card").parentElement;
    expect(card).toHaveClass("custom-class");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("DIV");
  });
});
