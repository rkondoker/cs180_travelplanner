import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders with default className", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("w-full px-3 py-2 rounded bg-white text-black");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });

  it("accepts and passes props", () => {
    render(
      <Input type="email" placeholder="Enter email" value="test@example.com" />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
    expect(input).toHaveValue("test@example.com");
  });
});
