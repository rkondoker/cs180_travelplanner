import { render, screen } from "@testing-library/react";
import { FormMessage, Message } from "@/components/form-message";
import "@testing-library/jest-dom";

describe("FormMessage", () => {
  it("renders a success message", () => {
    const message: Message = { success: "Operation successful!" };
    render(<FormMessage message={message} />);
    expect(screen.getByText("Operation successful!")).toBeInTheDocument();
    // Add assertion for success class if needed, based on actual implementation
    // expect(screen.getByText("Operation successful!").parentElement).toHaveClass("border-foreground");
  });

  it("renders an error message", () => {
    const message: Message = { error: "Something went wrong." };
    render(<FormMessage message={message} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    // Add assertion for error class if needed
    // expect(screen.getByText("Something went wrong.").parentElement).toHaveClass("border-destructive-foreground");
  });

  it("renders a general message", () => {
    const message: Message = { message: "Please review your input." };
    render(<FormMessage message={message} />);
    expect(screen.getByText("Please review your input.")).toBeInTheDocument();
    // Add assertion for general message class if needed
    // expect(screen.getByText("Please review your input.").parentElement).toHaveClass("border-l-2");
  });

  it("renders nothing if message object is empty (though types should prevent this)", () => {
    // This test case is primarily for robustness, although the Message type should prevent an empty object
    const message = {} as Message; // Cast to Message to satisfy type checking
    render(<FormMessage message={message} />);
    // Assuming no text should be rendered for an empty message object
    expect(screen.queryByText("Operation successful!")).toBeNull();
    expect(screen.queryByText("Something went wrong.")).toBeNull();
    expect(screen.queryByText("Please review your input.")).toBeNull();
  });
});
