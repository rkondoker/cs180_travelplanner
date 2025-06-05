import { render, screen } from "@testing-library/react";
import About from "@/components/about";
import teamMembers from "@/app/data/Members/members";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("About Component", () => {
  it("renders team section with all members", () => {
    render(<About />);

    // Check team section heading
    expect(screen.getByText("Meet Our Team")).toBeInTheDocument();

    // Check each team member
    teamMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      // Use a more flexible text matcher for roles
      expect(
        screen.getByText((content, element) => {
          return element?.textContent === member.role;
        }),
      ).toBeInTheDocument();
    });
  });

  it("renders story section", () => {
    render(<About />);

    // Check story section heading
    expect(screen.getByText("Our Story")).toBeInTheDocument();

    // Check story content
    expect(
      screen.getByText(/TripWise was born from a simple observation/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We believe that everyone deserves to experience the joy of travel/,
      ),
    ).toBeInTheDocument();
  });

  it("renders with correct styling classes", () => {
    render(<About />);

    // Check main container
    const container = screen.getByTestId("about-container");
    expect(container).toHaveClass(
      "min-h-screen",
      "w-full",
      "bg-gradient-to-b",
      "from-blue-400",
      "to-green-600",
    );

    // Check team section
    const teamSection = screen.getByTestId("team-section");
    expect(teamSection).toHaveClass(
      "min-h-[600px]",
      "py-16",
      "bg-white/5",
      "flex",
      "flex-col",
      "justify-center",
    );

    // Check story section
    const storySection = screen.getByTestId("story-section");
    expect(storySection).toHaveClass(
      "min-h-[600px]",
      "py-16",
      "bg-white/10",
      "backdrop-blur-sm",
      "flex",
      "flex-col",
      "justify-center",
    );
  });

  it("renders team member cards with correct styling", () => {
    render(<About />);

    const teamCards = screen.getAllByTestId("team-member-card");
    teamCards.forEach((card) => {
      expect(card).toHaveClass(
        "bg-white/20",
        "p-8",
        "rounded-xl",
        "backdrop-blur-sm",
        "hover:transform",
        "hover:scale-150",
        "transition-transform",
        "duration-150",
      );
    });
  });

  it("renders story card with correct styling", () => {
    render(<About />);

    const storyCard = screen.getByTestId("story-card");
    expect(storyCard).toHaveClass(
      "bg-white/20",
      "p-12",
      "rounded-xl",
      "backdrop-blur-sm",
      "hover:transform",
      "hover:scale-110",
      "transition-transform",
      "duration-150",
    );
  });
});
