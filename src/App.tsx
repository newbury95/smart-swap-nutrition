
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session); // Debug log
      console.log('Current path:', location.pathname); // Debug log
      return session;
    };

    const initializeAuth = async () => {
      try {
        const session = await checkAuth();
        setIsAuthenticated(!!session);
        
        if (session) {
          console.log('User is authenticated'); // Debug log
          if (authRoutes.includes(location.pathname)) {
            navigate('/diary');
          }
        } else {
          console.log('User is not authenticated'); // Debug log
          if (protectedRoutes.includes(location.pathname)) {
            navigate('/signup');
          }
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          console.log('Auth state changed:', session ? 'authenticated' : 'unauthenticated'); // Debug log
          const isAuthed = !!session;
          setIsAuthenticated(isAuthed);
          
          if (isAuthed && authRoutes.includes(location.pathname)) {
            navigate('/diary');
          } else if (!isAuthed && protectedRoutes.includes(location.pathname)) {
            navigate('/signup');
          }
        });

        setIsInitialized(true);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    initializeAuth();
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
