import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "../../../app/(auth-pages)/sign-up/page";
import { signUpAction } from "../../../app/actions";
import { createClient } from "../../../utils/supabase/server";
import { encodedRedirect } from "../../../utils/utils";
import { Message } from "../../../components/form-message";

// Mock the server actions and utilities
jest.mock("../../../app/actions", () => ({
  signUpAction: jest.fn(),
}));

jest.mock("../../../utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("../../../utils/utils", () => ({
  encodedRedirect: jest
    .fn()
    .mockImplementation((type, path, message) => `${type}:${path}:${message}`),
}));

// Mock Next.js components and hooks
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

jest.mock("next/headers", () => ({
  headers: jest
    .fn()
    .mockReturnValue(new Map([["origin", "http://localhost:3000"]])),
}));

describe("Sign Up Page", () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
      },
      from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      })),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("renders sign up form with all required fields", async () => {
    render(
      await Signup({
        searchParams: Promise.resolve({ message: "" } as Message),
      }),
    );

    // Check heading and description
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/)).toBeInTheDocument();

    // Check form fields
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("displays error message when provided in searchParams", async () => {
    const errorMessage = "Invalid email format";
    render(
      await Signup({
        searchParams: Promise.resolve({
          error: errorMessage,
        } as Message),
      }),
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("handles successful sign up", async () => {
    const mockUser = { id: "user123" };
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    render(
      await Signup({
        searchParams: Promise.resolve({ message: "" } as Message),
      }),
    );

    // Fill in the form
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

    // Verify Supabase calls
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockSupabase.from().insert).toHaveBeenCalledWith({
      user_id: "user123",
      joined_on: expect.any(String),
      username: "testuser",
    });
  });

  it("handles sign up errors", async () => {
    const errorMessage = "Email already in use";
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: errorMessage },
    });

    render(
      await Signup({
        searchParams: Promise.resolve({ message: "" } as Message),
      }),
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "existinguser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Verify error handling
    expect(encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/sign-up",
      errorMessage,
    );
  });

  it("handles database insertion errors", async () => {
    const mockUser = { id: "user123" };
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        error: { message: "Failed to insert user data" },
      }),
    });

    render(
      await Signup({
        searchParams: Promise.resolve({ message: "" } as Message),
      }),
    );

    // Fill in the form
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

    // Verify error handling
    expect(encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/sign-up",
      "Failed to save user info.",
    );
  });

  it("applies correct styling classes", async () => {
    render(
      await Signup({
        searchParams: Promise.resolve({ message: "" } as Message),
      }),
    );

    // Check main container
    const mainContainer = screen.getByRole("generic", { hidden: true });
    expect(mainContainer).toHaveClass(
      "min-h-screen",
      "flex",
      "items-center",
      "justify-center",
    );

    // Check form container
    const formContainer = screen
      .getByRole("generic", { hidden: true })
      .querySelector(".bg-trip-brown-200");
    expect(formContainer).toHaveClass(
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
      "w-1/4",
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
});
