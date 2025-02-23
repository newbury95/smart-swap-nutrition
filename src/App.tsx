
import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";

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
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const supabase = (window as any).supabase;
    if (!supabase) return;

    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (!session && !location.pathname.includes('/signup')) {
        navigate('/signup');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session && !location.pathname.includes('/signup')) {
        navigate('/signup');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  if (isAuthenticated === null) {
    return <LoadingFallback />;
  }

  return (
    <>
      {isAuthenticated && <Header />}
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
