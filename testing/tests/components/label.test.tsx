import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("renders children text", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Styled Label</Label>);
    const label = screen.getByText("Styled Label");
    expect(label).toHaveClass("custom-class");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("LABEL");
  });

  it("accepts and passes props", () => {
    render(<Label htmlFor="input-id">Label for Input</Label>);
    const label = screen.getByText("Label for Input");
    expect(label).toHaveAttribute("for", "input-id");
  });
});
