
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Mail, Ruler, Weight, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";
import { generateUsername } from "@/utils/userNameGenerator";
import { Switch } from "@/components/ui/switch";

interface SignUpFormProps {
  onSuccess: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setSignupEmail] = useState("");
  const [password, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePremiumToggle = (checked: boolean) => {
    setIsPremium(checked);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // If premium is selected, redirect to Stripe payment
    if (isPremium) {
      window.open("https://buy.stripe.com/3cs7vfbo97269pudQQ", "_blank");
      setIsLoading(false);
      onSuccess();
      return;
    }
    
    try {
      // Generate a username from first and last name
      const username = generateUsername(firstName, lastName);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            height: Number(height),
            weight: Number(weight),
            is_premium: false,
            username: username, // Add the generated username
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Account created!",
        description: "Check your email to verify your account.",
      });
      
      onSuccess();
      
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
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="First Name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          icon={<User className="h-4 w-4" />}
        />
        <FormField
          id="lastName"
          label="Last Name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          icon={<User className="h-4 w-4" />}
        />
      </div>
      
      <FormField
        id="signupEmail"
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setSignupEmail(e.target.value)}
        icon={<Mail className="h-4 w-4" />}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="height"
          label="Height (cm)"
          type="number"
          required
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          icon={<Ruler className="h-4 w-4" />}
        />
        <FormField
          id="weight"
          label="Weight (kg)"
          type="number"
          required
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          icon={<Weight className="h-4 w-4" />}
        />
      </div>
      
      <FormField
        id="signupPassword"
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setSignupPassword(e.target.value)}
        icon={<Lock className="h-4 w-4" />}
      />
      
      <FormField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={<Lock className="h-4 w-4" />}
      />
      
      <div className="border-t border-gray-200 pt-4 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Premium Subscription</h3>
            <p className="text-xs text-gray-500">Get access to premium features</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">Free</span>
            <Switch
              checked={isPremium}
              onCheckedChange={handlePremiumToggle}
            />
            <span className="text-xs font-medium text-green-600">Premium £7.99/mo</span>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : isPremium ? "Complete Payment" : "Create Account"}
      </Button>
    </form>
  );
};
