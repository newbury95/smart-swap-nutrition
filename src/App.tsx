
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

import Index from './pages/Index';
import SignUp from './pages/SignUp';
import PersonalInfo from './pages/signup/PersonalInfo';
import FoodDiary from './pages/diary/FoodDiary';
import TrackingPage from './pages/tracking/TrackingPage';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!session) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setHasProfile(!!profile);
      setCheckingProfile(false);
    };

    checkProfile();
  }, [session]);

  if (isLoading || checkingProfile) {
    return <div>Loading...</div>;
  }

  if (!session) {
    console.log('No session in protected route, redirecting to signup');
    return <Navigate to="/signup" />;
  }

  if (hasProfile === false) {
    console.log('No profile found, redirecting to personal info');
    return <Navigate to="/signup/personal-info" />;
  }

  return <>{children}</>;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route path="/signup" element={
        <AuthenticatedRoute>
          <SignUp />
        </AuthenticatedRoute>
      } />
      <Route path="/signup/personal-info" element={
        <AuthenticatedRoute>
          <PersonalInfo />
        </AuthenticatedRoute>
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
