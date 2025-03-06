
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  isPremium: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  password: string;
  recaptchaToken?: string;
}

export function useSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const handleSignup = useCallback(async (formData: SignupFormData) => {
  if (isSubmitting) return false;
  setIsSubmitting(true);
  setError(null);

  try {
    console.log("Starting signup with:", formData);

    // Ensure recaptcha and password are provided
    if (!formData.recaptchaToken) throw new Error("Please complete the reCAPTCHA verification");
    if (!formData.password) throw new Error("Password is required");

    // ✅ Ensure `date_of_birth` is provided
    if (!formData.dateOfBirth) {
      throw new Error("Date of Birth is required.");
    }

    // ✅ Convert `DD-MM-YYYY` to `YYYY-MM-DD`
    const dobParts = formData.dateOfBirth.split("-");
    if (dobParts.length !== 3) {
      throw new Error("Invalid date format. Please use DD-MM-YYYY.");
    }
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`; // Convert to YYYY-MM-DD

    const isPremiumValue = formData.isPremium ?? false;

    // Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          nickname: formData.nickname,
          date_of_birth: formattedDOB, // ✅ Fixed date format
          height: formData.height,
          weight: formData.weight,
          is_premium: isPremiumValue
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No user data returned from signup");

    console.log("User signed up:", authData.user.id);

    // Insert profile into `profiles` table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        nickname: formData.nickname,
        date_of_birth: formattedDOB, // ✅ Fixed date format
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        is_premium: isPremiumValue
      }]);

    if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);

    console.log("Profile created successfully!");

    toast({
      title: "Success!",
      description: `Your ${isPremiumValue ? 'premium' : 'free'} profile has been created.`,
    });

    navigate("/diary");

    return true;
  } catch (error) {
    console.error('Signup error:', error);
    setError(error instanceof Error ? error.message : "Signup failed.");
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "Signup failed.",
    });
    return false;
  } finally {
    setIsSubmitting(false);
  }
}, [navigate, toast, isSubmitting]);
