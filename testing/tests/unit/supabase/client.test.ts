import { createClient } from "../../../../utils/supabase/client";

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn((url, key) => ({
    url,
    key,
  })),
}));

describe("Supabase Browser Client", () => {
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

  it("should create a browser client with correct environment variables", () => {
    const client = createClient();

    expect(client).toEqual({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  });

  it("should throw error when environment variables are missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = undefined;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined;

    expect(() => createClient()).toThrow();
  });
});
