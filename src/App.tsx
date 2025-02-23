
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
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  if (!session) {
    console.log('No session in protected route, redirecting to signup');
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

const SignUpRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  if (session) {
    console.log('Session found in signup route, redirecting to diary');
    return <Navigate to="/diary" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Signup flow routes */}
      <Route path="/signup" element={
        <SignUpRoute>
          <SignUp />
        </SignUpRoute>
      } />
      <Route path="/signup/personal-info" element={
        <SignUpRoute>
          <PersonalInfo />
        </SignUpRoute>
      } />
      
      {/* Protected routes requiring authentication */}
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
