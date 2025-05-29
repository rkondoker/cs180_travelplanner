"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface AIActivitySuggestionsProps {
  city: string;
  stateOrCountry: string;
  startDate: string;
  endDate: string;
}

export default function AIActivitySuggestions({
  city,
  stateOrCountry,
  startDate,
  endDate,
}: AIActivitySuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `You are a travel planning assistant. The user is planning a trip to ${city}, ${stateOrCountry} from ${startDate} to ${endDate}. 
      Please provide helpful suggestions and recommendations based on their query: ${userMessage}
      Focus on providing specific, actionable suggestions that would be relevant for their trip.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-trip-brown-100 text-trip-brown-200 hover:bg-[#cbb192]"
      >
        {isOpen ? "Close AI Assistant" : "Get AI Activity Suggestions"}
      </Button>

      {isOpen && (
        <Card className="mt-4 p-4 bg-white text-black">
          <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-trip-brown-100 text-trip-brown-200 ml-auto"
                    : "bg-gray-100"
                } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500">Thinking...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about activities, attractions, or local tips..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-trip-brown-100 text-trip-brown-200 hover:bg-[#cbb192]"
            >
              Send
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
} 