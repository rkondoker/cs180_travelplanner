import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "@/app/(auth-pages)/sign-up/page";
import { signUpAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import "@testing-library/jest-dom";

// Mock the signUpAction
jest.mock("@/app/actions", () => ({
  signUpAction: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Sign Up Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign up form with all required elements", () => {
    render(<Signup searchParams={Promise.resolve({} as Message)} />);

    // Check for main heading
    expect(screen.getByText("Create Account")).toBeInTheDocument();

    // Check for sign in link
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toHaveAttribute("href", "/sign-in");

    // Check for form inputs
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("handles form submission with valid credentials", async () => {
    const mockSignUpAction = signUpAction as jest.Mock;
    mockSignUpAction.mockResolvedValueOnce({ success: true });

    render(<Signup searchParams={Promise.resolve({} as Message)} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Check if signUpAction was called with correct data
    await waitFor(() => {
      expect(mockSignUpAction).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("displays error message when sign up fails", async () => {
    const mockSignUpAction = signUpAction as jest.Mock;
    mockSignUpAction.mockResolvedValueOnce({
      error: "Email already in use",
    });

    render(
      <Signup
        searchParams={Promise.resolve({
          error: "Email already in use",
        } as Message)}
      />,
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText("Email already in use")).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    render(<Signup searchParams={Promise.resolve({} as Message)} />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Check that the form validation prevents submission
    expect(screen.getByLabelText("Email")).toBeInvalid();
    expect(screen.getByLabelText("Username")).toBeInvalid();
    expect(screen.getByLabelText("Password")).toBeInvalid();
    expect(screen.getByLabelText("Confirm Password")).toBeInvalid();
  });

  it("shows loading state during form submission", async () => {
    const mockSignUpAction = signUpAction as jest.Mock;
    mockSignUpAction.mockImplementation(() => new Promise(() => {}));

    render(<Signup searchParams={Promise.resolve({} as Message)} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Check for loading state
    expect(screen.getByText("Signing up...")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<Signup searchParams={Promise.resolve({} as Message)} />);

    // Check main container
    const container = screen.getByRole("form").parentElement;
    expect(container).toHaveClass(
      "bg-trip-brown-200",
      "p-8",
      "rounded-xl",
      "w-[32rem]",
      "shadow-lg",
      "font-trip-main",
    );

    // Check submit button
    const submitButton = screen.getByRole("button", { name: "Sign Up" });
    expect(submitButton).toHaveClass(
      "bg-trip-brown-100",
      "text-trip-brown-200",
      "px-4",
      "py-2",
      "rounded-full",
      "font-semibold",
      "hover:bg-[#cbb192]",
      "hover:scale-105",
      "transition",
    );
  });

  it("displays success message after successful signup", async () => {
    const mockSignUpAction = signUpAction as jest.Mock;
    mockSignUpAction.mockResolvedValueOnce({
      message: "Account created successfully",
    });

    render(
      <Signup
        searchParams={Promise.resolve({
          message: "Account created successfully",
        } as Message)}
      />,
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Check for success message
    await waitFor(() => {
      expect(
        screen.getByText("Account created successfully"),
      ).toBeInTheDocument();
    });
  });
});
