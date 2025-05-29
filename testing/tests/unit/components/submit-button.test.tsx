import { render, screen } from "@testing-library/react";
import { SubmitButton } from "@/components/submit-button";

// Mock the Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock useFormStatus
jest.mock("react-dom", () => ({
  useFormStatus: () => ({ pending: false }),
}));

// Create a wrapper component with form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <form>{children}</form>
);

describe("SubmitButton", () => {
  it("renders children when not pending", () => {
    render(
      <FormWrapper>
        <SubmitButton>Submit</SubmitButton>
      </FormWrapper>,
    );
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders pending text when pending", () => {
    // Override the mock for this test
    jest
      .mocked(require("react-dom").useFormStatus)
      .mockReturnValue({ pending: true });

    render(
      <FormWrapper>
        <SubmitButton pendingText="Loading...">Submit</SubmitButton>
      </FormWrapper>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("uses default pending text when not provided", () => {
    jest
      .mocked(require("react-dom").useFormStatus)
      .mockReturnValue({ pending: true });

    render(
      <FormWrapper>
        <SubmitButton>Submit</SubmitButton>
      </FormWrapper>,
    );
    expect(screen.getByText("Submitting...")).toBeInTheDocument();
  });

  it("applies aria-disabled attribute based on pending state", () => {
    const { rerender } = render(
      <FormWrapper>
        <SubmitButton>Submit</SubmitButton>
      </FormWrapper>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );

    jest
      .mocked(require("react-dom").useFormStatus)
      .mockReturnValue({ pending: true });
    rerender(
      <FormWrapper>
        <SubmitButton>Submit</SubmitButton>
      </FormWrapper>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });

  it("passes through additional props to Button component", () => {
    render(
      <FormWrapper>
        <SubmitButton className="custom-class" data-testid="submit-btn">
          Submit
        </SubmitButton>
      </FormWrapper>,
    );
    const button = screen.getByTestId("submit-btn");
    expect(button).toHaveClass("custom-class");
  });
});
