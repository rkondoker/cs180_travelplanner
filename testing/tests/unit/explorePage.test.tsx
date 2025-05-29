import React from "react";
import { render, screen } from "@testing-library/react";
import ExplorePage from "@/app/explore/page";

describe("ExplorePage", () => {
  it("renders the Google Map", () => {
    render(<ExplorePage />);
    const mapElement = screen.getByTestId("google-map");
    expect(mapElement).toBeInTheDocument();
  });

  it("renders exactly one marker", () => {
    render(<ExplorePage />);
    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(1);
  });
});
