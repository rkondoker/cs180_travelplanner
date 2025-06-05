import { render, screen } from "@testing-library/react";
import { SubmitButton } from "@/components/submit-button";
import { useFormStatus } from "react-dom";
import "@testing-library/jest-dom";

// Mock the useFormStatus hook
jest.mock("react-dom", () => ({
  useFormStatus: jest.fn(),
}));

// Mock the Button component from ui
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe("SubmitButton", () => {
  const mockUseFormStatus = useFormStatus as jest.Mock;

  beforeEach(() => {
    mockUseFormStatus.mockClear();
  });

  it("renders with default text when not pending", () => {
    mockUseFormStatus.mockReturnValue({ pending: false });
    render(<SubmitButton>Submit</SubmitButton>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders with custom pending text when pending", () => {
    mockUseFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton pendingText="Processing...">Submit</SubmitButton>);
    expect(
      screen.getByRole("button", { name: "Processing..." }),
    ).toBeInTheDocument();
  });

  it("renders with default pending text when pending and no custom text is provided", () => {
    mockUseFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton>Submit</SubmitButton>);
    expect(
      screen.getByRole("button", { name: "Submitting..." }),
    ).toBeInTheDocument();
  });

  it("passes through other props to the button", () => {
    mockUseFormStatus.mockReturnValue({ pending: false });
    render(
      <SubmitButton className="custom-class" data-testid="submit-btn">
        Submit
      </SubmitButton>,
    );
    const button = screen.getByTestId("submit-btn");
    expect(button).toHaveClass("custom-class");
  });

  it("disables the button when pending", () => {
    mockUseFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton>Submit</SubmitButton>);
    expect(
      screen.getByRole("button", { name: "Submitting..." }),
    ).toBeDisabled();
  });

  it("does not disable the button when not pending", () => {
    mockUseFormStatus.mockReturnValue({ pending: false });
    render(<SubmitButton>Submit</SubmitButton>);
    expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
  });
});
