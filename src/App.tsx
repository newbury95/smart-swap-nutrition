
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import TopBanner from "@/components/navigation/TopBanner";
import Footer from "@/components/navigation/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

// Use lazy loading for routes to improve initial load performance
const IndexPage = lazy(() => import("@/pages/Index"));
const TrackingPage = lazy(() => import("@/pages/tracking/TrackingPage"));
const DiaryPage = lazy(() => import("@/pages/diary/FoodDiary"));
const MealPlansPage = lazy(() => import("@/pages/meal-plans/MealPlansPage"));
const PremiumPage = lazy(() => import("@/pages/premium/PremiumUpgradePage"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const BlogsPage = lazy(() => import("@/pages/forum/ForumPage"));
const ThreadDetailPage = lazy(() => import("@/pages/forum/ThreadDetailPage"));
const ContactPage = lazy(() => import("@/pages/contact/ContactPage"));
const WorkoutPlansPage = lazy(() => import("@/pages/premium/WorkoutPlansPage"));
const AboutPage = lazy(() => import("@/pages/about/AboutPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage"));
const TermsOfUsePage = lazy(() => import("@/pages/legal/TermsOfUsePage"));

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

// Layout component to provide consistent structure
const Layout = ({ children, showTopBanner = true }: { children: React.ReactNode, showTopBanner?: boolean }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showTopBanner && <TopBanner />}
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
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
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={
            <Layout>
              {user ? <Navigate to="/diary" /> : <IndexPage />}
            </Layout>
          } />
          <Route 
            path="/tracking" 
            element={
              <ProtectedRoute>
                <Layout>
                  <TrackingPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/diary" 
            element={
              <ProtectedRoute>
                <Layout>
                  <DiaryPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/meal-plans" 
            element={
              <ProtectedRoute>
                <PremiumRoute>
                  <Layout>
                    <MealPlansPage />
                  </Layout>
                </PremiumRoute>
              </ProtectedRoute>
            } 
          />
          <Route path="/premium" element={
            <Layout>
              <PremiumPage />
            </Layout>
          } />
          <Route path="/auth" element={
            <Layout showTopBanner={false}>
              <AuthPage />
            </Layout>
          } />
          <Route 
            path="/forum" 
            element={
              <ProtectedRoute>
                <Layout>
                  <BlogsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forum/thread/:threadId" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ThreadDetailPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="/contact" element={
            <Layout>
              <ContactPage />
            </Layout>
          } />
          <Route 
            path="/workouts" 
            element={
              <ProtectedRoute>
                <PremiumRoute>
                  <Layout>
                    <WorkoutPlansPage />
                  </Layout>
                </PremiumRoute>
              </ProtectedRoute>
            } 
          />
          {/* New footer pages */}
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
          <Route path="/privacy" element={
            <Layout>
              <PrivacyPolicyPage />
            </Layout>
          } />
          <Route path="/terms" element={
            <Layout>
              <TermsOfUsePage />
            </Layout>
          } />
          <Route path="*" element={
            <Layout>
              <Navigate to="/" replace />
            </Layout>
          } />
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
