
import React, { Suspense, lazy } from "react";
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

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageLoading />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

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

function App() {
  const { user, loading } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-700">Something went wrong with the application. Please refresh the page.</div>}>
            <TopBanner />
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={user ? <TrackingPage /> : <IndexPage />} />
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
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signup/personal-info" element={<PersonalInfo />} />
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
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
