
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
  if (isSubmitting) return false; // Prevent multiple submissions
  setIsSubmitting(true);
  setError(null);

  try {
    console.log("FormData before signup:", JSON.stringify(formData, null, 2));  // Line 47

    // Validate reCAPTCHA
    if (!formData.recaptchaToken) {
      throw new Error("Please complete the reCAPTCHA verification");
    }

    // Ensure we have a password
    if (!formData.password) {
      throw new Error("Password is required");
    }

    // Convert date to YYYY-MM-DD format (INSERT HERE)
    const dobParts = formData.dateOfBirth.split("-"); // Line 57
    if (dobParts.length !== 3) {
      throw new Error("Invalid date format. Please use DD-MM-YYYY.");
    }
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`; // Line 60

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          nickname: formData.nickname,
          date_of_birth: formattedDOB,  // ✅ Use the correctly formatted date
          height: formData.height,
          weight: formData.weight,
          is_premium: formData.isPremium ?? false,
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    console.log("Auth success, user ID:", authData.user?.id);

  } catch (error) {
    console.error('Error during signup:', error);
    setError(error instanceof Error ? error.message : "Failed to create profile");
  } finally {
    setIsSubmitting(false);
  }
}, [navigate, toast, isSubmitting]);
