
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
  
  // Show loading spinner while checking auth state or profile
  if (isLoading || checkingProfile) {
    return <LoadingSpinner />;
  }

  // Redirect to signup if not authenticated
  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  // Redirect to personal-info if no profile (except if already there)
  if (hasProfile === false && window.location.pathname !== '/signup/personal-info') {
    return <Navigate to="/signup/personal-info" replace />;
  }

  return <>{children}</>;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, hasProfile } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (session) {
    // If they have a profile, send them to diary, otherwise to personal info
    if (hasProfile === false) {
      return <Navigate to="/signup/personal-info" replace />;
    }
    return <Navigate to="/diary" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    
    <Route
      path="/signup"
      element={
        <AuthenticatedRoute>
          <SignUp />
        </AuthenticatedRoute>
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

const App = () => (
  <Router>
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  </Router>
);

export default App;
