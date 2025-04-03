
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { ThreadItem } from "../ThreadItem";

describe("ThreadItem", () => {
  const mockThread = {
    id: "1",
    title: "Test Thread",
    content: "Test content",
    user_id: "user1",
    created_at: "Apr 2, 2025",
    author: "Test User",
    username: "testuser",
    replies: 5,
    likes: 10
  };

  const mockOnReportThread = vi.fn();
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders thread information correctly", () => {
    render(
      <ThreadItem 
        thread={mockThread}
        onReportThread={mockOnReportThread}
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText("Test Thread")).toBeInTheDocument();
    expect(screen.getByText(/By @testuser/)).toBeInTheDocument();
    expect(screen.getByText(/Apr 2, 2025/)).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); // Likes count
    expect(screen.getByText("5")).toBeInTheDocument(); // Replies count
  });

  test("calls onClick when thread is clicked", () => {
    render(
      <ThreadItem 
        thread={mockThread}
        onReportThread={mockOnReportThread}
        onClick={mockOnClick}
      />
    );
    
    // Click on the thread container
    fireEvent.click(screen.getByText("Test Thread").closest("div")!);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("calls onReportThread when report button is clicked", () => {
    render(
      <ThreadItem 
        thread={mockThread}
        onReportThread={mockOnReportThread}
        onClick={mockOnClick}
      />
    );
    
    // Find and click on the report (flag) button
    const reportButton = screen.getByRole("button");
    fireEvent.click(reportButton);
    
    expect(mockOnReportThread).toHaveBeenCalledWith("1");
    expect(mockOnClick).not.toHaveBeenCalled(); // Main click handler should not be called
  });

  test("stops event propagation when report button is clicked", () => {
    render(
      <ThreadItem 
        thread={mockThread}
        onReportThread={mockOnReportThread}
        onClick={mockOnClick}
      />
    );
    
    // Create a mock event with stopPropagation
    const mockEvent = { stopPropagation: vi.fn() };
    
    // Find the report button and simulate a click with our mock event
    const reportButton = screen.getByRole("button");
    fireEvent.click(reportButton, mockEvent);
    
    // Check that stopPropagation was called
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
