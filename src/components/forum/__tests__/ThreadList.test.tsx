
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ThreadList } from "../ThreadList";
import { useThreadList } from "../hooks/useThreadList";

// Mock the useThreadList hook
vi.mock("../hooks/useThreadList", () => ({
  useThreadList: vi.fn()
}));

// Mock the child components
vi.mock("../ThreadItem", () => ({
  ThreadItem: ({ thread, onReportThread, onClick }: any) => (
    <div 
      data-testid={`thread-item-${thread.id}`}
      onClick={onClick}
    >
      <span>Thread title: {thread.title}</span>
      <button 
        data-testid={`report-button-${thread.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onReportThread(thread.id);
        }}
      >
        Report
      </button>
    </div>
  )
}));

vi.mock("../ThreadListLoading", () => ({
  ThreadListLoading: () => <div data-testid="thread-list-loading">Loading...</div>
}));

vi.mock("../EmptyThreadList", () => ({
  EmptyThreadList: () => <div data-testid="empty-thread-list">No blogs yet</div>
}));

describe("ThreadList", () => {
  const mockNavigate = vi.fn();
  const mockReportThread = vi.fn();
  
  // Mock threads data
  const mockThreads = [
    {
      id: "1",
      title: "First Thread",
      content: "Content 1",
      user_id: "user1",
      created_at: "Apr 2, 2025",
      author: "Test User",
      username: "testuser",
      replies: 5,
      likes: 10
    },
    {
      id: "2",
      title: "Second Thread",
      content: "Content 2",
      user_id: "user2",
      created_at: "Apr 1, 2025",
      author: "Another User",
      username: "anotheruser",
      replies: 3,
      likes: 7
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state when isLoading is true", () => {
    // Mock the hook to return loading state
    (useThreadList as any).mockReturnValue({
      threads: [],
      isLoading: true
    });
    
    render(
      <BrowserRouter>
        <ThreadList onReportThread={mockReportThread} requireAuthForInteraction={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId("thread-list-loading")).toBeInTheDocument();
  });

  test("renders empty state when no threads are available", () => {
    // Mock the hook to return empty threads array
    (useThreadList as any).mockReturnValue({
      threads: [],
      isLoading: false
    });
    
    render(
      <BrowserRouter>
        <ThreadList onReportThread={mockReportThread} requireAuthForInteraction={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId("empty-thread-list")).toBeInTheDocument();
  });

  test("renders threads when they are available", () => {
    // Mock the hook to return threads
    (useThreadList as any).mockReturnValue({
      threads: mockThreads,
      isLoading: false
    });
    
    render(
      <BrowserRouter>
        <ThreadList onReportThread={mockReportThread} requireAuthForInteraction={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId("thread-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("thread-item-2")).toBeInTheDocument();
    expect(screen.getByText("Thread title: First Thread")).toBeInTheDocument();
    expect(screen.getByText("Thread title: Second Thread")).toBeInTheDocument();
  });

  test("calls navigation when a thread is clicked", () => {
    // Mock the useNavigate hook
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });

    // Mock the hook to return threads
    (useThreadList as any).mockReturnValue({
      threads: mockThreads,
      isLoading: false
    });
    
    render(
      <BrowserRouter>
        <ThreadList onReportThread={mockReportThread} requireAuthForInteraction={true} />
      </BrowserRouter>
    );
    
    // Click on a thread
    fireEvent.click(screen.getByTestId("thread-item-1"));
    
    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/forum/thread/1");
  });

  test("calls onReportThread when report button is clicked", () => {
    // Mock the hook to return threads
    (useThreadList as any).mockReturnValue({
      threads: mockThreads,
      isLoading: false
    });
    
    render(
      <BrowserRouter>
        <ThreadList onReportThread={mockReportThread} requireAuthForInteraction={true} />
      </BrowserRouter>
    );
    
    // Click on the report button
    fireEvent.click(screen.getByTestId("report-button-1"));
    
    // Check if onReportThread was called with the correct id
    expect(mockReportThread).toHaveBeenCalledWith("1");
  });
});
