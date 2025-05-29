import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "@/app/(auth-pages)/sign-up/page";

// Mock the Link component from next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock the SubmitButton and FormMessage components
jest.mock("@/components/submit-button", () => ({
  SubmitButton: ({ children, pendingText, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/form-message", () => ({
  FormMessage: ({ message }: { message: any }) =>
    message && "message" in message ? (
      <div data-testid="form-message">{message.message}</div>
    ) : null,
}));

describe("Signup Page", () => {
  it("renders the sign-up form with all fields", async () => {
    render(await Signup({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      expect(screen.getByText("Create Account")).toBeInTheDocument();
    });

    // Check for the "Sign in" link
    const signInLink = screen.getByRole("link", { name: /Sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/sign-in");

    // Check for input fields
    expect(
      screen.getByPlaceholderText(/email@example.com/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/user_example/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm Your Password/i),
    ).toBeInTheDocument();

    // Check for the submit button
    expect(
      screen.getByRole("button", { name: /Sign Up/i }),
    ).toBeInTheDocument();
  });

  it("renders a message if searchParams contains one", async () => {
    const testMessage = { message: "This is a test message" };
    render(await Signup({ searchParams: Promise.resolve(testMessage) }));

    await waitFor(() => {
      const formMessage = screen.getByTestId("form-message");
      expect(formMessage).toBeInTheDocument();
      expect(formMessage).toHaveTextContent("This is a test message");
    });
  });

  it("does not render a message if searchParams is empty", async () => {
    render(await Signup({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      expect(screen.queryByTestId("form-message")).not.toBeInTheDocument();
    });
  });

  it("input fields have required attribute", async () => {
    render(await Signup({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const usernameInput = screen.getByRole("textbox", { name: /username/i });
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(emailInput).toBeRequired();
      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
      expect(confirmPasswordInput).toBeRequired();
    });
  });
});
