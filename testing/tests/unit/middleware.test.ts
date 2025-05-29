import { NextRequest } from "next/server";
import { middleware } from "../../../middleware";
import { updateSession } from "../../../utils/supabase/middleware";

// Mock the updateSession function
jest.mock("../../../utils/supabase/middleware", () => ({
  updateSession: jest.fn(),
}));

// Mock NextRequest and Response
jest.mock("next/server", () => ({
  NextRequest: jest.fn().mockImplementation((url) => ({
    url,
    headers: new Headers(),
    nextUrl: new URL(url),
  })),
}));

// Mock Response
const mockResponse = {
  body: null,
  status: 200,
  statusText: "OK",
  headers: new Headers(),
  ok: true,
  redirected: false,
  type: "default",
  url: "",
};

global.Response = jest.fn().mockImplementation((body, init) => ({
  ...mockResponse,
  body,
  ...init,
})) as any;

// Add static methods
(global.Response as any).error = jest.fn().mockReturnValue(new Response(null, { status: 500 }));
(global.Response as any).json = jest.fn().mockReturnValue(new Response(null, { status: 200 }));
(global.Response as any).redirect = jest.fn().mockReturnValue(new Response(null, { status: 302 }));

describe("Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("middleware function", () => {
    it("calls updateSession with the request", async () => {
      // Create a mock request
      const mockRequest = new NextRequest("http://localhost:3000");
      
      // Mock the updateSession response
      const mockResponse = new Response();
      (updateSession as jest.Mock).mockResolvedValue(mockResponse);

      // Call the middleware
      const response = await middleware(mockRequest);

      // Verify updateSession was called with the request
      expect(updateSession).toHaveBeenCalledWith(mockRequest);
      expect(response).toBe(mockResponse);
    });

    it("handles updateSession errors gracefully", async () => {
      // Create a mock request
      const mockRequest = new NextRequest("http://localhost:3000");
      
      // Mock updateSession to throw an error
      const mockError = new Error("Session update failed");
      (updateSession as jest.Mock).mockRejectedValue(mockError);

      // Call the middleware and expect it to throw
      await expect(middleware(mockRequest)).rejects.toThrow("Session update failed");
    });

    it("passes through the response from updateSession", async () => {
      // Create a mock request
      const mockRequest = new NextRequest("http://localhost:3000");
      
      // Create a mock response with specific properties
      const mockResponse = new Response(null, {
        status: 302,
        headers: new Headers({ Location: "/auth/callback" }),
      });
      (updateSession as jest.Mock).mockResolvedValue(mockResponse);

      // Call the middleware
      const response = await middleware(mockRequest);

      // Verify the response properties are preserved
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/auth/callback");
    });
  });

  describe("matcher configuration", () => {
    it("has correct matcher pattern", () => {
      // Import the config directly from the middleware file
      const { config } = require("../../../middleware");

      // Verify the matcher pattern
      expect(config.matcher).toHaveLength(1);
      expect(config.matcher[0]).toBe(
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
      );
    });

    it("matches application routes", () => {
      const { config } = require("../../../middleware");
      const matcherPattern = new RegExp(config.matcher[0]);
      
      // Test various application routes
      const routes = [
        "/",
        "/about",
        "/my-trips",
        "/trip-planner",
        "/api/auth/callback",
        "/auth/signin",
        "/auth/signup",
        "/auth/signout",
      ];

      routes.forEach(route => {
        expect(matcherPattern.test(route)).toBe(true);
      });
    });

    it("excludes static and media files", () => {
      const { config } = require("../../../middleware");
      const matcherPattern = new RegExp(config.matcher[0]);
      
      // Test various static and media files
      const staticFiles = [
        "/_next/static/abc123",
        "/_next/image?url=abc123",
        "/favicon.ico",
        "/images/logo.png",
        "/images/photo.jpg",
        "/images/icon.svg",
        "/images/animation.gif",
        "/images/banner.webp",
        "/public/assets/image.png",
        "/public/favicon.ico",
      ];

      staticFiles.forEach(file => {
        expect(matcherPattern.test(file)).toBe(false);
      });
    });

    it("handles query parameters correctly", () => {
      const { config } = require("../../../middleware");
      const matcherPattern = new RegExp(config.matcher[0]);
      
      // Test URLs with query parameters
      expect(matcherPattern.test("/my-trips?filter=active")).toBe(true);
      expect(matcherPattern.test("/trip-planner?edit=trip123")).toBe(true);
      expect(matcherPattern.test("/_next/image?url=abc123")).toBe(false);
    });
  });
}); 