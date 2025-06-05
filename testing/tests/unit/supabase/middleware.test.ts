import { updateSession } from "../../../../utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

// Mock next/server
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn((options) => ({
      ...options,
      cookies: {
        set: jest.fn(),
      },
      request: options.request,
    })),
    redirect: jest.fn((url) => ({
      url,
      status: 302,
    })),
  },
}));

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
  })),
}));

describe("Supabase Middleware", () => {
  const originalEnv = process.env;
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    mockRequest = {
      headers: new Headers(),
      cookies: {
        getAll: jest.fn(() => []),
        set: jest.fn(),
      },
      nextUrl: {
        pathname: "/",
        url: "http://localhost:3000",
      },
    } as unknown as NextRequest;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should redirect to sign-in when accessing protected route without auth", async () => {
    mockRequest.nextUrl.pathname = "/account";
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(() => ({
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ error: new Error("Not authenticated") }),
      },
    }));

    const response = await updateSession(mockRequest);
    expect(response.status).toBe(302);
    expect(response.url).toBe("http://localhost:3000/sign-in");
  });

  it("should redirect to account when accessing home with auth", async () => {
    mockRequest.nextUrl.pathname = "/";
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({ error: null }),
      },
    }));

    const response = await updateSession(mockRequest);
    expect(response.status).toBe(302);
    expect(response.url).toBe("http://localhost:3000/account");
  });

  it("should continue to next middleware for non-protected routes", async () => {
    mockRequest.nextUrl.pathname = "/public";
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({ error: null }),
      },
    }));

    const response = await updateSession(mockRequest);
    expect(response).toHaveProperty("request");
    expect((response as any).request.headers).toBe(mockRequest.headers);
  });

  it("should handle Supabase client creation error gracefully", async () => {
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(() => {
      throw new Error("Failed to create client");
    });

    const response = await updateSession(mockRequest);
    expect(response).toHaveProperty("request");
    expect((response as any).request.headers).toBe(mockRequest.headers);
  });
});
