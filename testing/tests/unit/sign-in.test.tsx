import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/(auth-pages)/sign-in/page";
import { signInAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import "@testing-library/jest-dom";

// Mock the signInAction
jest.mock("@/app/actions", () => ({
  signInAction: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Sign In Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign in form with all required elements", () => {
    render(<Login searchParams={Promise.resolve({} as Message)} />);

    // Check for main heading
    expect(screen.getByText("Log in")).toBeInTheDocument();

    // Check for sign up link
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toHaveAttribute("href", "/sign-up");

    // Check for form inputs
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("handles form submission with valid credentials", async () => {
    const mockSignInAction = signInAction as jest.Mock;
    mockSignInAction.mockResolvedValueOnce({ success: true });

    render(<Login searchParams={Promise.resolve({} as Message)} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Check if signInAction was called with correct data
    await waitFor(() => {
      expect(mockSignInAction).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("displays error message when sign in fails", async () => {
    const mockSignInAction = signInAction as jest.Mock;
    mockSignInAction.mockResolvedValueOnce({
      error: "Invalid email or password",
    });

    render(
      <Login
        searchParams={Promise.resolve({
          error: "Invalid email or password",
        } as Message)}
      />,
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    render(<Login searchParams={Promise.resolve({} as Message)} />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Check that the form validation prevents submission
    expect(screen.getByLabelText("Email")).toBeInvalid();
    expect(screen.getByLabelText("Password")).toBeInvalid();
  });

  it("shows loading state during form submission", async () => {
    const mockSignInAction = signInAction as jest.Mock;
    mockSignInAction.mockImplementation(() => new Promise(() => {}));

    render(<Login searchParams={Promise.resolve({} as Message)} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Check for loading state
    expect(screen.getByText("Signing In...")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<Login searchParams={Promise.resolve({} as Message)} />);

    // Check main container
    const container = screen.getByRole("form").parentElement;
    expect(container).toHaveClass(
      "bg-trip-brown-200",
      "rounded-xl",
      "p-8",
      "shadow-lg",
      "w-125",
    );

    // Check submit button
    const submitButton = screen.getByRole("button", { name: "Log In" });
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
      "text-center",
    );
  });
});
