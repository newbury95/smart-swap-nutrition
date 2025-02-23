
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from './providers/AuthProvider';

import Index from './pages/Index';
import SignUp from './pages/SignUp';
import PersonalInfo from './pages/signup/PersonalInfo';
import FoodDiary from './pages/diary/FoodDiary';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, hasProfile, checkingProfile } = useAuth();
  
  if (isLoading || checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signup" replace />;
  }

  // Only redirect to personal-info if we know for sure there's no profile
  if (hasProfile === false) {
    if (window.location.pathname !== '/signup/personal-info') {
      return <Navigate to="/signup/personal-info" replace />;
    }
  }

  return <>{children}</>;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/diary" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
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
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
