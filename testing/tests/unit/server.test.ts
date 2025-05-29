import { createClient } from "../../../utils/supabase/server";
import { cookies } from "next/headers";

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

// Define the type for our mock function
interface MockCreateServerClient extends jest.Mock {
  mockOptions?: {
    cookies: {
      getAll: () => Array<{ name: string; value: string }>;
      setAll: (
        cookies: Array<{ name: string; value: string; options?: any }>,
      ) => void;
    };
  };
}

describe("Server Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a Supabase client with correct configuration", async () => {
    // Mock environment variables
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    };

    // Mock cookies
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([
        { name: "cookie1", value: "value1" },
        { name: "cookie2", value: "value2" },
      ]),
      set: jest.fn(),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Mock createServerClient
    const mockCreateServerClient = jest
      .fn()
      .mockImplementation((url, key, options) => {
        // Store the options for later verification
        (mockCreateServerClient as MockCreateServerClient).mockOptions =
          options;
        return {
          auth: {
            getUser: jest.fn(),
          },
        };
      }) as MockCreateServerClient;
    require("@supabase/ssr").createServerClient = mockCreateServerClient;

    // Call the function
    await createClient();

    // Verify createServerClient was called with correct arguments
    expect(mockCreateServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    );

    // Restore environment variables
    process.env = originalEnv;
  });

  it("handles cookie operations correctly", async () => {
    // Mock environment variables
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    };

    // Mock cookies
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([
        { name: "cookie1", value: "value1" },
        { name: "cookie2", value: "value2" },
      ]),
      set: jest.fn(),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Mock createServerClient with cookie handlers
    const mockCreateServerClient = jest
      .fn()
      .mockImplementation((url, key, options) => {
        // Store the options for later verification
        (mockCreateServerClient as MockCreateServerClient).mockOptions =
          options;
        return {
          auth: {
            getUser: jest.fn(),
          },
        };
      }) as MockCreateServerClient;
    require("@supabase/ssr").createServerClient = mockCreateServerClient;

    // Call the function
    await createClient();

    // Get the cookie handlers from the stored options
    const cookieHandlers = mockCreateServerClient.mockOptions?.cookies;

    // Test getAll
    const cookieList = cookieHandlers?.getAll();
    expect(cookieList).toEqual([
      { name: "cookie1", value: "value1" },
      { name: "cookie2", value: "value2" },
    ]);

    // Test setAll
    const cookiesToSet = [
      { name: "newCookie", value: "newValue", options: { path: "/" } },
    ];
    cookieHandlers?.setAll(cookiesToSet);
    expect(mockCookieStore.set).toHaveBeenCalledWith("newCookie", "newValue", {
      path: "/",
    });

    // Restore environment variables
    process.env = originalEnv;
  });

  it("handles cookie set errors gracefully", async () => {
    // Mock environment variables
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    };

    // Mock cookies with error
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn().mockImplementation(() => {
        throw new Error("Cookie set error");
      }),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Mock createServerClient with cookie handlers
    const mockCreateServerClient = jest
      .fn()
      .mockImplementation((url, key, options) => {
        // Store the options for later verification
        (mockCreateServerClient as MockCreateServerClient).mockOptions =
          options;
        return {
          auth: {
            getUser: jest.fn(),
          },
        };
      }) as MockCreateServerClient;
    require("@supabase/ssr").createServerClient = mockCreateServerClient;

    // Call the function
    await createClient();

    // Get the cookie handlers from the stored options
    const cookieHandlers = mockCreateServerClient.mockOptions?.cookies;

    // Test setAll with error
    const cookiesToSet = [
      { name: "newCookie", value: "newValue", options: { path: "/" } },
    ];
    expect(() => cookieHandlers?.setAll(cookiesToSet)).not.toThrow();

    // Restore environment variables
    process.env = originalEnv;
  });
});
