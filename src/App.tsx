
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
    return <div>Loading...</div>;
  }

  if (!session) {
    console.log('No session in protected route, redirecting to signup');
    return <Navigate to="/signup" />;
  }

  return <>{children}</>;
};

const SignUpRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is already authenticated and tries to access signup pages,
  // redirect them to the diary
  if (session) {
    console.log('Session found in signup route, redirecting to diary');
    return <Navigate to="/diary" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Signup flow routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup/personal-info" element={<PersonalInfo />} />
      
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
