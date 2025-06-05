import { GET } from "@/app/auth/callback/route";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn(),
  },
}));

describe("Auth Callback Route", () => {
  const mockExchangeCodeForSession = jest.fn();
  const mockCreateClient = createClient as jest.Mock;
  const mockNextResponseRedirect = NextResponse.redirect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    });
  });

  it("handles authentication code and redirects to protected route", async () => {
    // Mock request with auth code
    const request = new Request(
      "http://localhost:3000/auth/callback?code=test-code",
    );

    // Execute the route handler
    await GET(request);

    // Verify Supabase client was created
    expect(mockCreateClient).toHaveBeenCalled();

    // Verify code exchange was attempted
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");

    // Verify redirect to protected route
    expect(mockNextResponseRedirect).toHaveBeenCalledWith(
      "http://localhost:3000/protected",
    );
  });

  it("handles authentication code with custom redirect", async () => {
    // Mock request with auth code and custom redirect
    const request = new Request(
      "http://localhost:3000/auth/callback?code=test-code&redirect_to=/dashboard",
    );

    // Execute the route handler
    await GET(request);

    // Verify Supabase client was created
    expect(mockCreateClient).toHaveBeenCalled();

    // Verify code exchange was attempted
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");

    // Verify redirect to custom route
    expect(mockNextResponseRedirect).toHaveBeenCalledWith(
      "http://localhost:3000/dashboard",
    );
  });

  it("handles request without auth code", async () => {
    // Mock request without auth code
    const request = new Request("http://localhost:3000/auth/callback");

    // Execute the route handler
    await GET(request);

    // Verify Supabase client was created
    expect(mockCreateClient).toHaveBeenCalled();

    // Verify code exchange was not attempted
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();

    // Verify redirect to protected route
    expect(mockNextResponseRedirect).toHaveBeenCalledWith(
      "http://localhost:3000/protected",
    );
  });

  it("handles Supabase client creation error", async () => {
    // Mock Supabase client creation error
    mockCreateClient.mockRejectedValueOnce(
      new Error("Failed to create client"),
    );

    // Mock request with auth code
    const request = new Request(
      "http://localhost:3000/auth/callback?code=test-code",
    );

    // Execute the route handler
    await GET(request);

    // Verify redirect still occurs despite error
    expect(mockNextResponseRedirect).toHaveBeenCalledWith(
      "http://localhost:3000/protected",
    );
  });

  it("handles code exchange error", async () => {
    // Mock code exchange error
    mockExchangeCodeForSession.mockRejectedValueOnce(
      new Error("Failed to exchange code"),
    );

    // Mock request with auth code
    const request = new Request(
      "http://localhost:3000/auth/callback?code=test-code",
    );

    // Execute the route handler
    await GET(request);

    // Verify redirect still occurs despite error
    expect(mockNextResponseRedirect).toHaveBeenCalledWith(
      "http://localhost:3000/protected",
    );
  });

  it("preserves query parameters in redirect URL", async () => {
    // Mock request with auth code and query parameters
    const request = new Request(
      "http://localhost:3000/auth/callback?code=test-code&redirect_to=/dashboard?param1=value1&param2=value2",
    );

    // Execute the route handler
    await GET(request);

    // Verify redirect preserves query parameters
    expect(mockNextResponseRedirect).toHaveBeenCalledWith(
      "http://localhost:3000/dashboard?param1=value1&param2=value2",
    );
  });
});
