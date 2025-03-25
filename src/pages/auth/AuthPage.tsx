
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Parse query parameters
  const params = new URLSearchParams(location.search);
  const tabParam = params.get("tab");
  const redirectParam = params.get("redirect");
  const isPremium = params.get("premium") === "true";

  useEffect(() => {
    // Set active tab based on query parameter
    if (tabParam === "signup" || tabParam === "signin") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (redirectParam) {
          navigate(`/${redirectParam}`);
        } else {
          navigate("/diary");
        }
      }
    };
    
    checkUser();
  }, [navigate, redirectParam]);

  const handleSignInSuccess = () => {
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    
    if (redirectParam) {
      navigate(`/${redirectParam}`);
    } else {
      navigate("/diary");
    }
  };

  const handleSignUpSuccess = () => {
    toast({
      title: "Account created!",
      description: "Your account has been successfully created.",
    });
    
    if (isPremium) {
      // Redirect to payment page for premium users
      window.open("https://buy.stripe.com/3cs7vfbo97269pudQQ", "_blank");
      navigate("/diary");
    } else if (redirectParam) {
      navigate(`/${redirectParam}`);
    } else {
      navigate("/diary");
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center p-4">
      <AuthContainer 
        title={showResetForm ? "Reset Password" : (activeTab === "signin" ? "Welcome Back" : (isPremium ? "Premium Sign Up" : "Create Account"))}
        description={showResetForm ? "Enter your email to receive a reset link" : (activeTab === "signin" ? "Sign in to continue to your account" : (isPremium ? "Sign up for premium access" : "Sign up to get started with your account"))}
        onBackToHome={handleBackToHome}
      >
        {showResetForm ? (
          <PasswordResetForm 
            onBack={() => setShowResetForm(false)}
          />
        ) : (
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-0">
              <SignInForm 
                onSuccess={handleSignInSuccess} 
                onForgotPassword={() => setShowResetForm(true)}
              />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <SignUpForm onSuccess={handleSignUpSuccess} />
            </TabsContent>
          </Tabs>
        )}
      </AuthContainer>
    </div>
  );
};

export default AuthPage;
