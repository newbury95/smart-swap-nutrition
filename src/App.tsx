
import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import TopBanner from "@/components/navigation/TopBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Use lazy loading for routes to improve initial load performance
const IndexPage = lazy(() => import("@/pages/Index"));
const TrackingPage = lazy(() => import("@/pages/tracking/TrackingPage"));
const DiaryPage = lazy(() => import("@/pages/diary/FoodDiary"));
const MealPlansPage = lazy(() => import("@/pages/meal-plans/MealPlansPage"));
const PremiumPage = lazy(() => import("@/pages/premium/PremiumUpgradePage"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const SignupPage = lazy(() => import("@/pages/SignUp"));
const PersonalInfo = lazy(() => import("@/pages/signup/PersonalInfo"));
const ForumPage = lazy(() => import("@/pages/forum/ForumPage"));
const ContactPage = lazy(() => import("@/pages/contact/ContactPage"));
const WorkoutPlansPage = lazy(() => import("@/pages/premium/WorkoutPlansPage"));

// Create a loading fallback component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
  </div>
);

// Configure query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching data on window focus
      retry: 1, // Only retry failed queries once
      staleTime: 60000, // Consider data fresh for 1 minute
      gcTime: 300000, // Garbage collect after 5 minutes
    },
  },
});

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return <PageLoading />;
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
};

// AppRoutes component to handle routing after auth is available
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = window.location.pathname;
  const isAuthPage = location === "/auth";

  if (loading) {
    return <PageLoading />;
  }

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-700">Something went wrong with the application. Please refresh the page.</div>}>
      {!isAuthPage && <TopBanner />}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/diary" /> : <IndexPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route 
            path="/diary" 
            element={
              <ProtectedRoute>
                <DiaryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/meal-plans" 
            element={
              <ProtectedRoute>
                <MealPlansPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/auth" element={user ? <Navigate to="/diary" /> : <AuthPage />} />
          <Route path="/signup" element={user ? <Navigate to="/diary" /> : <SignupPage />} />
          <Route path="/signup/personal-info" element={user ? <Navigate to="/diary" /> : <PersonalInfo />} />
          <Route path="/personal-info" element={<Navigate to="/signup/personal-info" replace />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route 
            path="/workouts" 
            element={
              <ProtectedRoute>
                <WorkoutPlansPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
