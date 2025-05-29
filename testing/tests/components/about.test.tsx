import { render, screen } from "@testing-library/react";
import About from "../../../components/about";
import teamMembers from "../../../app/data/Members/members";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("About Component", () => {
  it("renders the team section with correct heading", () => {
    render(<About />);
    expect(screen.getByText("Meet Our Team")).toBeInTheDocument();
  });

  it("renders all team members", () => {
    render(<About />);
    teamMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
    });
  });

  it("renders team member images with correct alt text", () => {
    render(<About />);
    teamMembers.forEach((member) => {
      const image = screen.getByAltText(member.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", member.image);
    });
  });

  it("renders the story section with correct heading", () => {
    render(<About />);
    expect(screen.getByText("Our Story")).toBeInTheDocument();
  });

  it("renders the story content", () => {
    render(<About />);
    expect(
      screen.getByText(
        "TripWise was born from a simple observation: planning trips can be overwhelming and time-consuming. We wanted to create a solution that would make travel planning not just easier, but more enjoyable."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We believe that everyone deserves to experience the joy of travel without the stress of planning, and TripWise is our way of making that possible."
      )
    ).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<About />);
    
    // Check main container
    const mainContainer = screen.getByRole("generic", { hidden: true });
    expect(mainContainer).toHaveClass("min-h-screen", "w-full", "bg-gradient-to-b", "from-blue-400", "to-green-600");

    // Check team section
    const teamSection = screen.getByText("Meet Our Team").closest("section");
    expect(teamSection).toHaveClass("min-h-[600px]", "py-16", "bg-white/5");

    // Check story section
    const storySection = screen.getByText("Our Story").closest("section");
    expect(storySection).toHaveClass("min-h-[600px]", "py-16", "bg-white/10", "backdrop-blur-sm");
  });

  it("renders team member cards with correct styling", () => {
    render(<About />);
    const teamMemberCards = screen.getAllByRole("generic", { hidden: true }).filter(
      (element) => element.className.includes("bg-white/20") && element.className.includes("p-8")
    );
    
    expect(teamMemberCards.length).toBe(teamMembers.length);
    teamMemberCards.forEach((card) => {
      expect(card).toHaveClass(
        "bg-white/20",
        "p-8",
        "rounded-xl",
        "backdrop-blur-sm",
        "hover:transform",
        "hover:scale-150",
        "transition-transform",
        "duration-150"
      );
    });
  });
}); 