
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import PersonalInfo from "./pages/signup/PersonalInfo";
import FoodDiary from "./pages/diary/FoodDiary";
import TrackingPage from "./pages/tracking/TrackingPage";
import Header from "./components/Header";

const queryClient = new QueryClient();

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
    return <div>Loading...</div>;
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/personal-info" element={<PersonalInfo />} />
            <Route path="/diary" element={<FoodDiary />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
