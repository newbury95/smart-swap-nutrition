
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  const params = new URLSearchParams(location.search);
  const tabParam = params.get('tab');
  const redirectParam = params.get('redirect');
  
  const [isResetMode, setIsResetMode] = useState(false);
  const [activeTab, setActiveTab] = useState(tabParam === 'signup' ? 'signup' : 'signin');

  useEffect(() => {
    if (!loading && user) {
      if (redirectParam === 'premium') {
        navigate('/premium');
      } else {
        navigate('/diary');
      }
    }
  }, [loading, user, navigate, redirectParam]);

  const handleSuccessfulSignIn = () => {
    if (redirectParam === 'premium') {
      navigate('/premium');
    } else {
      navigate("/diary");
    }
  };

  const handleSuccessfulSignUp = () => {
    setActiveTab("signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 m-4">There was an error loading the authentication page.</div>}>
      <AuthContainer 
        title="NutriTrack" 
        description="Your journey to a healthier lifestyle starts here"
        onBackToHome={() => navigate('/')}
      >
        {isResetMode ? (
          <PasswordResetForm onBack={() => setIsResetMode(false)} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <SignInForm 
                onForgotPassword={() => setIsResetMode(true)}
                onSuccess={handleSuccessfulSignIn}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm onSuccess={handleSuccessfulSignUp} />
            </TabsContent>
          </Tabs>
        )}
      </AuthContainer>
    </ErrorBoundary>
  );
};

export default AuthPage;
