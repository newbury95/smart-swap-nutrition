import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import TopBanner from "@/components/navigation/TopBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

// Use lazy loading for routes to improve initial load performance
const IndexPage = lazy(() => import("@/pages/Index"));
const TrackingPage = lazy(() => import("@/pages/tracking/TrackingPage"));
const DiaryPage = lazy(() => import("@/pages/diary/FoodDiary"));
const MealPlansPage = lazy(() => import("@/pages/meal-plans/MealPlansPage"));
const PremiumPage = lazy(() => import("@/pages/premium/PremiumUpgradePage"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const ForumPage = lazy(() => import("@/pages/forum/ForumPage"));
const ThreadDetailPage = lazy(() => import("@/pages/forum/ThreadDetailPage"));
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
  
  React.useEffect(() => {
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

// PremiumRoute component to handle premium access
const PremiumRoute = ({ children }: { children: React.ReactNode }) => {
  const { isPremium, loading } = usePremiumStatus();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!loading && !isPremium) {
      navigate("/premium", { replace: true });
    }
  }, [isPremium, loading, navigate]);
  
  if (loading) {
    return <PageLoading />;
  }
  
  if (!isPremium) {
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
          <Route 
            path="/tracking" 
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            } 
          />
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
                <PremiumRoute>
                  <MealPlansPage />
                </PremiumRoute>
              </ProtectedRoute>
            } 
          />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/forum" 
            element={
              <ProtectedRoute>
                <ForumPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forum/thread/:threadId" 
            element={
              <ProtectedRoute>
                <ThreadDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route 
            path="/workouts" 
            element={
              <ProtectedRoute>
                <PremiumRoute>
                  <WorkoutPlansPage />
                </PremiumRoute>
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
