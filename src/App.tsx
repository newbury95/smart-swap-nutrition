
import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { supabase } from "@/integrations/supabase/client";

// Lazy load route components
const Index = lazy(() => import("./pages/Index"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PersonalInfo = lazy(() => import("./pages/signup/PersonalInfo"));
const FoodDiary = lazy(() => import("./pages/diary/FoodDiary"));
const TrackingPage = lazy(() => import("./pages/tracking/TrackingPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

// Define which routes require authentication
const protectedRoutes = ['/diary', '/tracking'];
const authRoutes = ['/signup', '/signup/personal-info'];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } };

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);

        // Set up auth state change listener
        authSubscription = await supabase.auth.onAuthStateChange((_event, session) => {
          const isAuthed = !!session;
          setIsAuthenticated(isAuthed);

          // Handle routing based on auth state
          if (isAuthed) {
            if (authRoutes.includes(location.pathname)) {
              navigate('/diary');
            }
          } else {
            if (protectedRoutes.includes(location.pathname)) {
              navigate('/signup');
            }
          }
        });

        // Initial routing
        if (isAuthed) {
          if (authRoutes.includes(location.pathname)) {
            navigate('/diary');
          }
        } else {
          if (protectedRoutes.includes(location.pathname)) {
            navigate('/signup');
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      // Clean up subscription on unmount
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

  // Show loading state while checking auth
  if (!isInitialized) {
    return <LoadingFallback />;
  }

  return (
    <>
      {isAuthenticated && location.pathname !== '/' && <Header />}
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup/personal-info" element={<PersonalInfo />} />
              <Route path="/diary" element={<FoodDiary />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

