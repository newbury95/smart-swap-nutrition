import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate("/diary");
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "Password reset instructions have been sent to your email.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 m-4">There was an error loading the authentication page.</div>}>
      <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
        <div className="p-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>Back to Home</span>
          </button>
        </div>
        
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg mx-auto">
          <h1 className="text-2xl font-semibold text-center mb-6">
            {isResetMode ? "Reset Password" : "Sign In"}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={isResetMode ? handlePasswordReset : handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {!isResetMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (isResetMode ? "Sending..." : "Signing in...") 
                : (isResetMode ? "Send Reset Instructions" : "Sign In")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsResetMode(!isResetMode)}
              className="text-sm text-green-600 hover:text-green-700"
            >
              {isResetMode ? "Back to Sign In" : "Forgot Password?"}
            </button>
          </div>

          {!isResetMode && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AuthPage;
