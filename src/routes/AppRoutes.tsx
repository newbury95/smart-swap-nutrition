import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { PageLoading } from "@/components/PageLoading";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Layout from "@/components/layout/Layout";
import CookiePolicyPage from "@/pages/legal/CookiePolicyPage";

// Load components with better chunk naming for more efficient caching
const IndexPage = lazy(() => import("@/pages/Index") /* webpackChunkName: "index-page" */);
const TrackingPage = lazy(() => import("@/pages/tracking/TrackingPage") /* webpackChunkName: "tracking-page" */);
const DiaryPage = lazy(() => import("@/pages/diary/FoodDiary") /* webpackChunkName: "diary-page" */);
const MealPlansPage = lazy(() => import("@/pages/meal-plans/MealPlansPage") /* webpackChunkName: "meal-plans-page" */);
const PremiumPage = lazy(() => import("@/pages/premium/PremiumUpgradePage") /* webpackChunkName: "premium-page" */);
const AuthPage = lazy(() => import("@/pages/auth/AuthPage") /* webpackChunkName: "auth-page" */);
const BlogsPage = lazy(() => import("@/pages/forum/ForumPage") /* webpackChunkName: "forum-page" */);
const ThreadDetailPage = lazy(() => import("@/pages/forum/ThreadDetailPage") /* webpackChunkName: "thread-detail-page" */);
const ContactPage = lazy(() => import("@/pages/contact/ContactPage") /* webpackChunkName: "contact-page" */);
const WorkoutPlansPage = lazy(() => import("@/pages/premium/WorkoutPlansPage") /* webpackChunkName: "workout-plans-page" */);
const OffersPage = lazy(() => import("@/pages/offers/OffersPage") /* webpackChunkName: "offers-page" */);
const AboutPage = lazy(() => import("@/pages/about/AboutPage") /* webpackChunkName: "about-page" */);
const PrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage") /* webpackChunkName: "privacy-page" */);
const TermsOfUsePage = lazy(() => import("@/pages/legal/TermsOfUsePage") /* webpackChunkName: "terms-page" */);

// ProtectedRoute component to handle authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
const PremiumRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const AppRoutes: React.FC = () => {
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
          <Route 
            path="/offers" 
            element={
              <ProtectedRoute>
                <PremiumRoute>
                  <Layout>
                    <OffersPage />
                  </Layout>
                </PremiumRoute>
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="*" element={
            <Layout>
              <Navigate to="/" replace />
            </Layout>
          } />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
