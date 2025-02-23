
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from './providers/AuthProvider';

import Index from './pages/Index';
import SignUp from './pages/SignUp';
import PersonalInfo from './pages/signup/PersonalInfo';
import FoodDiary from './pages/diary/FoodDiary';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, hasProfile, checkingProfile } = useAuth();
  console.log('ProtectedRoute:', { 
    sessionExists: !!session, 
    isLoading, 
    hasProfile, 
    checkingProfile,
    currentPath: window.location.pathname 
  });
  
  if (isLoading || checkingProfile) {
    console.log('ProtectedRoute: Still loading...');
    return <LoadingSpinner />;
  }

  if (!session) {
    console.log('ProtectedRoute: No session, redirecting to signup');
    return <Navigate to="/signup" replace />;
  }

  // Only redirect to personal-info if the user has no profile and isn't already on the personal-info page
  if (!hasProfile && window.location.pathname !== '/signup/personal-info') {
    console.log('ProtectedRoute: No profile, redirecting to personal info');
    return <Navigate to="/signup/personal-info" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, hasProfile, checkingProfile } = useAuth();
  console.log('PublicRoute:', {
    sessionExists: !!session,
    isLoading,
    hasProfile,
    checkingProfile,
    currentPath: window.location.pathname
  });

  if (isLoading || checkingProfile) {
    return <LoadingSpinner />;
  }

  // If user is authenticated and has a profile, redirect them to diary
  if (session && hasProfile) {
    console.log('PublicRoute: User authenticated with profile, redirecting to diary');
    return <Navigate to="/diary" replace />;
  }

  // If user is authenticated but has no profile, redirect them to personal info
  if (session && !hasProfile && window.location.pathname !== '/signup/personal-info') {
    console.log('PublicRoute: User authenticated without profile, redirecting to personal info');
    return <Navigate to="/signup/personal-info" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  console.log('AppRoutes: Current path:', window.location.pathname);
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      
      <Route
        path="/signup/personal-info"
        element={
          <ProtectedRoute>
            <PersonalInfo />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/diary"
        element={
          <ProtectedRoute>
            <FoodDiary />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tracking"
        element={
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  </Router>
);

export default App;
