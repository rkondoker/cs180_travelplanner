import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/(auth-pages)/sign-in/page";

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

// Mock the signInAction
jest.mock("@/app/actions", () => ({
  signInAction: jest.fn(),
}));

describe("Sign In Page", () => {
  it("renders the sign-in form with all fields", async () => {
    render(await Login({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      expect(screen.getByText("Log in")).toBeInTheDocument();
    });

    // Check for the "Sign up" link
    const signUpLink = screen.getByRole("link", { name: /Sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/sign-up");

    // Check for input fields
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your password/i)).toBeInTheDocument();

    // Check for the submit button
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("renders a message if searchParams contains one", async () => {
    const testMessage = { message: "This is a test message" };
    render(await Login({ searchParams: Promise.resolve(testMessage) }));

    await waitFor(() => {
      const formMessage = screen.getByTestId("form-message");
      expect(formMessage).toBeInTheDocument();
      expect(formMessage).toHaveTextContent("This is a test message");
    });
  });

  it("does not render a message if searchParams is empty", async () => {
    render(await Login({ searchParams: Promise.resolve({ success: "" }) }));

    await waitFor(() => {
      expect(screen.queryByTestId("form-message")).not.toBeInTheDocument();
    });
  });

  it("input fields have required attribute", async () => {
    render(await Login({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/Your password/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  it("form has correct action", async () => {
    render(await Login({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      const form = screen.getByTestId("login-form");
      expect(form).toHaveAttribute("action", expect.any(String));
    });
  });

  it("submit button has correct pending text", async () => {
    render(await Login({ searchParams: Promise.resolve({ message: "" }) }));

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /Log In/i });
      expect(submitButton).toHaveAttribute("aria-disabled", "false");
    });
  });
});
