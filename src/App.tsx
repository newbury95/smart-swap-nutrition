
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
  const { session, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  // If no session, redirect to signup
  if (!session) {
    console.log('No session, redirecting to signup');
    return <Navigate to="/signup" replace />;
  }

  // If no profile, redirect to personal info
  if (!userProfile) {
    console.log('No user profile, redirecting to personal info');
    return <Navigate to="/signup/personal-info" replace />;
  }

  return <>{children}</>;
};

const SignUpFlow = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  // If user has completed signup (has session and profile), redirect to diary
  if (session && userProfile) {
    console.log('User has completed signup, redirecting to diary');
    return <Navigate to="/diary" replace />;
  }

  // If user has session but no profile, allow access only to personal-info
  if (session && !userProfile && window.location.pathname !== '/signup/personal-info') {
    console.log('User has session but no profile, redirecting to personal info');
    return <Navigate to="/signup/personal-info" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      
      {/* Signup flow */}
      <Route path="/signup" element={
        <SignUpFlow>
          <SignUp />
        </SignUpFlow>
      } />
      <Route path="/signup/personal-info" element={
        <SignUpFlow>
          <PersonalInfo />
        </SignUpFlow>
      } />
      
      {/* Protected routes */}
      <Route path="/diary" element={
        <ProtectedRoute>
          <FoodDiary />
        </ProtectedRoute>
      } />
      <Route path="/tracking" element={
        <ProtectedRoute>
          <TrackingPage />
        </ProtectedRoute>
      } />
      
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
