import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import "@testing-library/jest-dom";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Mock dependencies
// Mock cva and cn to simplify class testing, or test the output of buttonVariants directly if cva implementation is complex
// For now, we'll test the resulting classes on the rendered element.

// Mock @radix-ui/react-slot
jest.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children, ...props }: any) => (
    <div data-testid="slot" {...props}>
      {children}
    </div>
  ),
}));

// Mock @/lib/utils cn function to just join classes
jest.mock("@/lib/utils", () => ({
  cn: (...inputs: string[]) => inputs.join(" "),
}));

// Mock buttonVariants function to return simplified classes for testing
jest.mock("class-variance-authority", () => ({
  cva: jest.fn().mockImplementation((base, options) => {
    // Simulate cva behavior: apply base classes + variant/size classes
    return ({ variant, size, className }: any) => {
      const variantClass =
        options.variants.variant[variant || options.defaultVariants.variant];
      const sizeClass =
        options.variants.size[size || options.defaultVariants.size];
      return [base, variantClass, sizeClass, className]
        .filter(Boolean)
        .join(" ");
    };
  }),
}));

describe("Button Component", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();
    // Check for default classes (assuming 'default' variant and 'default' size)
    // These class names come from the actual buttonVariants definition in button.tsx
    expect(button).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "whitespace-nowrap",
      "rounded-md",
      "text-sm",
      "font-medium",
      "ring-offset-background",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2",
      "disabled:pointer-events-none",
      "disabled:opacity-50",
    );
    expect(button).toHaveClass(
      "bg-primary",
      "text-primary-foreground",
      "hover:bg-primary/90",
    ); // default variant classes
    expect(button).toHaveClass("h-10", "px-4", "py-2"); // default size classes
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    let button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground",
      "hover:bg-destructive/90",
    );

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button", { name: "Outline" });
    expect(button).toHaveClass(
      "border",
      "border-input",
      "bg-background",
      "hover:bg-accent",
      "hover:text-accent-foreground",
    );

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button", { name: "Secondary" });
    expect(button).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
      "hover:bg-secondary/80",
    );

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button", { name: "Ghost" });
    expect(button).toHaveClass(
      "hover:bg-accent",
      "hover:text-accent-foreground",
    );

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole("button", { name: "Link" });
    expect(button).toHaveClass(
      "text-primary",
      "underline-offset-4",
      "hover:underline",
    );
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole("button", { name: "Small" });
    expect(button).toHaveClass("h-9", "rounded-md", "px-3");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: "Large" });
    expect(button).toHaveClass("h-11", "rounded-md", "px-8");

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole("button", { name: "Icon" });
    expect(button).toHaveClass("h-10", "w-10");
  });

  it("renders as a child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const slot = screen.getByTestId("slot");
    expect(slot).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Link Button" }),
    ).toBeInTheDocument();
    // Check that the button classes are applied to the slot/child
    expect(slot).toHaveClass("inline-flex", "items-center"); // Check some base classes
    expect(slot).toHaveClass("bg-primary"); // Check default variant class
    expect(slot).toHaveClass("h-10"); // Check default size class
  });

  it("passes through standard button attributes", () => {
    const handleClick = jest.fn();
    render(
      <Button type="submit" disabled onClick={handleClick}>
        Submit
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("type", "submit");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="extra-class">Styled Button</Button>);
    const button = screen.getByRole("button", { name: "Styled Button" });
    expect(button).toHaveClass("extra-class");
    // Also check for some default classes to ensure they are preserved
    expect(button).toHaveClass("inline-flex");
  });

  it("combines variant, size, and className", () => {
    render(
      <Button variant="secondary" size="sm" className="combined-class">
        Combined
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Combined" });
    expect(button).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
      "hover:bg-secondary/80",
    );
    expect(button).toHaveClass("h-9", "rounded-md", "px-3");
    expect(button).toHaveClass("combined-class");
  });
});
