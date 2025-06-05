import { createClient } from "../../../../utils/supabase/server";

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
}));

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn((url, key, options) => ({
    url,
    key,
    options,
  })),
}));

describe("Supabase Server Client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should create a server client with correct environment variables", async () => {
    const client = await createClient();

    expect(client).toEqual({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      options: expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    });
  });

  it("should throw error when environment variables are missing", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = undefined;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined;

    await expect(createClient()).rejects.toThrow();
  });
});
