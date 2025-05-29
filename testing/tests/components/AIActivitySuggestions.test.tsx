import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AIActivitySuggestions from "@/components/AIActivitySuggestions";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock the GoogleGenerativeAI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest
            .fn()
            .mockResolvedValue("Here are some suggestions for your trip..."),
        },
      }),
    }),
  })),
}));

describe("AIActivitySuggestions", () => {
  const mockProps = {
    city: "Los Angeles",
    stateOrCountry: "California",
    startDate: "2024-03-20",
    endDate: "2024-03-25",
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders the initial button", () => {
    render(<AIActivitySuggestions {...mockProps} />);
    expect(screen.getByText("Get AI Activity Suggestions")).toBeInTheDocument();
  });

  it("toggles the AI assistant panel when button is clicked", () => {
    render(<AIActivitySuggestions {...mockProps} />);

    // Initially, the panel should not be visible
    expect(
      screen.queryByPlaceholderText(
        "Ask about activities, attractions, or local tips...",
      ),
    ).not.toBeInTheDocument();

    // Click the button to open the panel
    fireEvent.click(screen.getByText("Get AI Activity Suggestions"));

    // Panel should now be visible
    expect(
      screen.getByPlaceholderText(
        "Ask about activities, attractions, or local tips...",
      ),
    ).toBeInTheDocument();

    // Click again to close
    fireEvent.click(screen.getByText("Close AI Assistant"));

    // Panel should be hidden again
    expect(
      screen.queryByPlaceholderText(
        "Ask about activities, attractions, or local tips...",
      ),
    ).not.toBeInTheDocument();
  });

  it("handles message submission and displays response", async () => {
    render(<AIActivitySuggestions {...mockProps} />);

    // Open the panel
    fireEvent.click(screen.getByText("Get AI Activity Suggestions"));

    // Type a message
    const input = screen.getByPlaceholderText(
      "Ask about activities, attractions, or local tips...",
    );
    fireEvent.change(input, {
      target: { value: "What are some good restaurants?" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Check if loading state is shown
    expect(screen.getByText("Thinking...")).toBeInTheDocument();

    // Wait for the response
    await waitFor(() => {
      expect(
        screen.getByText("Here are some suggestions for your trip..."),
      ).toBeInTheDocument();
    });

    // Verify the input is cleared
    expect(input).toHaveValue("");
  });

  it("handles error cases", async () => {
    // Mock the generateContent to throw an error
    const mockError = new Error("API Error");
    (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockRejectedValue(mockError),
      }),
    }));

    render(<AIActivitySuggestions {...mockProps} />);

    // Open the panel
    fireEvent.click(screen.getByText("Get AI Activity Suggestions"));

    // Submit a message
    const input = screen.getByPlaceholderText(
      "Ask about activities, attractions, or local tips...",
    );
    fireEvent.change(input, {
      target: { value: "What are some good restaurants?" },
    });
    fireEvent.submit(screen.getByRole("form"));

    // Wait for the error message
    await waitFor(() => {
      expect(
        screen.getByText("Sorry, I encountered an error. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("prevents empty message submission", () => {
    render(<AIActivitySuggestions {...mockProps} />);

    // Open the panel
    fireEvent.click(screen.getByText("Get AI Activity Suggestions"));

    // Submit empty form
    fireEvent.submit(screen.getByRole("form"));

    // No messages should be added
    expect(screen.queryByText("Thinking...")).not.toBeInTheDocument();
  });
});
