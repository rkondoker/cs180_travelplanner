import { encodedRedirect } from "../../../utils/utils";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn((url) => {
    throw new Error(`Redirect to: ${url}`);
  }),
}));

describe("Utils", () => {
  describe("encodedRedirect", () => {
    it("should redirect with encoded error message", () => {
      const type = "error";
      const path = "/test";
      const message = "test error message";

      expect(() => encodedRedirect(type, path, message)).toThrow(
        `Redirect to: ${path}?${type}=${encodeURIComponent(message)}`,
      );
    });

    it("should redirect with encoded success message", () => {
      const type = "success";
      const path = "/dashboard";
      const message = "operation successful";

      expect(() => encodedRedirect(type, path, message)).toThrow(
        `Redirect to: ${path}?${type}=${encodeURIComponent(message)}`,
      );
    });

    it("should properly encode special characters in message", () => {
      const type = "error";
      const path = "/test";
      const message = "test & message with spaces";

      expect(() => encodedRedirect(type, path, message)).toThrow(
        `Redirect to: ${path}?${type}=${encodeURIComponent(message)}`,
      );
    });
  });
});
