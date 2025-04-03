
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useThreadList } from "../useThreadList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            {
              id: "1",
              title: "First Thread",
              content: "Content 1",
              user_id: "user1",
              created_at: "2025-04-02T10:00:00"
            }
          ],
          error: null
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({
            data: { first_name: "Test", last_name: "User" },
            error: null
          }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          head: vi.fn(() => Promise.resolve({
            count: 5,
            error: null
          }))
        }))
      }))
    })
  }
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}));

// Mock format function from date-fns
vi.mock("date-fns", () => ({
  format: vi.fn(() => "Apr 2, 2025")
}));

// Mock username generator
vi.mock("@/utils/userNameGenerator", () => ({
  generateUsername: vi.fn(() => "testuser")
}));

describe("useThreadList", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns threads and loading state", async () => {
    const { result } = renderHook(() => useThreadList(), { wrapper });
    
    // Initial state should be loading with empty threads array
    expect(result.current.isLoading).toBe(true);
    expect(result.current.threads).toEqual([]);
    
    // Wait for the query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Verify the threads data is processed correctly
    expect(result.current.threads).toHaveLength(1);
    expect(result.current.threads[0]).toHaveProperty("id", "1");
    expect(result.current.threads[0]).toHaveProperty("title", "First Thread");
    expect(result.current.threads[0]).toHaveProperty("author", "Test User");
    expect(result.current.threads[0]).toHaveProperty("username", "testuser");
    expect(result.current.threads[0]).toHaveProperty("replies", 5);
    expect(result.current.threads[0]).toHaveProperty("likes", 5);
    expect(result.current.threads[0]).toHaveProperty("created_at", "Apr 2, 2025");
  });

  test("shows toast on error", async () => {
    // Override the mock for this test to simulate an error
    const mockErrorSupabase = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({
            data: null,
            error: new Error("Database error")
          })
        })
      })
    };
    
    // Update the mock
    vi.mock("@/integrations/supabase/client", () => ({
      supabase: mockErrorSupabase
    }));
    
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({ toast: mockToast });
    
    const { result } = renderHook(() => useThreadList(), { wrapper });
    
    // Wait for the query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Verify error handling
    expect(mockToast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "Error",
      description: "Failed to load forum threads."
    });
    expect(result.current.threads).toEqual([]);
  });
});
