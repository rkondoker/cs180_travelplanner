import {
  signUpAction,
  signInAction,
  signOutAction,
  createTripAction,
  deleteTrip,
} from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { encodedRedirect } from "@/utils/utils";

// Mock the utils
jest.mock("@/utils/utils", () => ({
  encodedRedirect: jest.fn(
    (type, path, message) => `/${type}/${path}/${message}`,
  ),
}));

// Mock the Supabase client
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock next/headers
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Map([["origin", "http://localhost:3000"]])),
}));

describe("Server Actions", () => {
  let mockSupabase: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        eq: jest.fn(),
      })),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("signUpAction", () => {
    it("should handle missing fields", async () => {
      const formData = new FormData();
      await signUpAction(formData);
      expect(encodedRedirect).toHaveBeenCalledWith(
        "error",
        "/sign-up",
        "All fields are required.",
      );
    });

    it("should handle password mismatch", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("username", "testuser");
      formData.append("password", "password123");
      formData.append("confirmPassword", "password456");

      await signUpAction(formData);
      expect(encodedRedirect).toHaveBeenCalledWith(
        "error",
        "/sign-up",
        "Passwords do not match",
      );
    });

    it("should handle successful signup", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("username", "testuser");
      formData.append("password", "password123");
      formData.append("confirmPassword", "password123");

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: "user123" } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      await signUpAction(formData);
      expect(encodedRedirect).toHaveBeenCalledWith(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    });
  });

  describe("signInAction", () => {
    it("should handle successful sign in", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: null,
      });

      await signInAction(formData);
      expect(redirect).toHaveBeenCalledWith("/account");
    });

    it("should handle sign in error", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "wrongpassword");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: { message: "Invalid credentials" },
      });

      await signInAction(formData);
      expect(encodedRedirect).toHaveBeenCalledWith(
        "error",
        "/sign-in",
        "Invalid credentials",
      );
    });
  });

  describe("signOutAction", () => {
    it("should handle sign out", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });
      await signOutAction();
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("createTripAction", () => {
    it("should handle unauthenticated user", async () => {
      const formData = new FormData();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await createTripAction(formData);
      expect(encodedRedirect).toHaveBeenCalledWith(
        "error",
        "/sign-in",
        "You must be signed in to create a trip.",
      );
    });

    it("should create new trip", async () => {
      const formData = new FormData();
      formData.append("trip-name", "Test Trip");
      formData.append("destination", "California");
      formData.append("city", "Los Angeles");
      formData.append("start-date", "2024-01-01");
      formData.append("end-date", "2024-01-07");

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user123" } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      await createTripAction(formData);
      expect(redirect).toHaveBeenCalledWith("/my-trips");
    });

    it("should update existing trip", async () => {
      const formData = new FormData();
      formData.append("trip-name", "Updated Trip");
      formData.append("destination", "California");
      formData.append("city", "Los Angeles");
      formData.append("start-date", "2024-01-01");
      formData.append("end-date", "2024-01-07");
      formData.append("edit_id", "trip123");

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user123" } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await createTripAction(formData);
      expect(redirect).toHaveBeenCalledWith("/my-trips");
    });
  });

  describe("deleteTrip", () => {
    it("should handle successful deletion", async () => {
      const formData = new FormData();
      formData.append("tripId", "trip123");

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await deleteTrip(formData);
      expect(redirect).toHaveBeenCalledWith("/my-trips");
    });

    it("should handle deletion error", async () => {
      const formData = new FormData();
      formData.append("tripId", "trip123");

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest
            .fn()
            .mockResolvedValue({ error: { message: "Delete failed" } }),
        }),
      });

      await deleteTrip(formData);
      expect(encodedRedirect).toHaveBeenCalledWith(
        "error",
        "/my-trips",
        "Failed to delete trip. Please try again.",
      );
    });
  });
});
