import { render, screen } from "@testing-library/react";
import About from "@/components/about";
import teamMembers from "@/app/data/Members/members";

// Mock the Image component from next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("About Page", () => {
  it("renders the about container", () => {
    render(<About />);
    const container = screen.getByTestId("about-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the team section with correct heading", () => {
    render(<About />);
    const teamSection = screen.getByTestId("team-section");
    const heading = screen.getByText("Meet Our Team");

    expect(teamSection).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  it("renders all team member cards", () => {
    render(<About />);
    const teamMemberCards = screen.getAllByTestId("team-member-card");
    expect(teamMemberCards).toHaveLength(teamMembers.length);
  });

  it("renders team member information correctly", () => {
    render(<About />);
    teamMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
    });
  });

  it("renders the story section with correct heading", () => {
    render(<About />);
    const storySection = screen.getByTestId("story-section");
    const heading = screen.getByText("Our Story");

    expect(storySection).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  it("renders the story card with correct content", () => {
    render(<About />);
    const storyCard = screen.getByTestId("story-card");
    const storyText = screen.getByText(
      /TripWise was born from a simple observation/,
    );

    expect(storyCard).toBeInTheDocument();
    expect(storyText).toBeInTheDocument();
  });
});
