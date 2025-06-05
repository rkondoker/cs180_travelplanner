import { hasEnvVars } from "../../../../utils/supabase/check-env-vars";

describe("Supabase Environment Variables Check", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return true when both Supabase environment variables are set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    expect(hasEnvVars).toBe(true);
  });

  it("should return false when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = undefined;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    expect(hasEnvVars).toBe(false);
  });

  it("should return false when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined;

    expect(hasEnvVars).toBe(false);
  });

  it("should return false when both environment variables are missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = undefined;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined;

    expect(hasEnvVars).toBe(false);
  });
});
