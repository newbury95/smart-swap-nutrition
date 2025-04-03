
import { render, screen } from "@testing-library/react";
import { EmptyThreadList } from "../EmptyThreadList";

describe("EmptyThreadList", () => {
  test("renders the empty state message", () => {
    render(<EmptyThreadList />);
    
    // Check for the message text
    expect(screen.getByText(/No blogs yet/i)).toBeInTheDocument();
    
    // Check for the icon
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });
});
