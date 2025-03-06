import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  dateOfBirth: string; // Expected format: DD-MM-YYYY
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
      console.log("Starting signup process with data:", formData);

      // ✅ Validate reCAPTCHA
      if (!formData.recaptchaToken) {
        throw new Error("Please complete the reCAPTCHA verification");
      }

      // ✅ Ensure password is provided
      if (!formData.password) {
        throw new Error("Password is required");
      }

      // ✅ Convert date format from DD-MM-YYYY → YYYY-MM-DD
      const dobParts = formData.dateOfBirth.split("-");
      if (dobParts.length !== 3) {
        throw new Error("Invalid date format. Please use DD-MM-YYYY.");
      }
      const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
      console.log("Formatted DOB:", formattedDOB); // Debugging log

      // ✅ Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            nickname: formData.nickname,
            date_of_birth: formattedDOB,
            height: formData.height,
            weight: formData.weight,
            is_premium: formData.isPremium ?? false, // Ensure it's not null
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData?.user) {
        throw new Error("No user data returned from signup.");
      }

      console.log("Auth success, user ID:", authData.user.id);

      // ✅ Create user profile in Supabase database
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            nickname: formData.nickname,
            date_of_birth: formattedDOB,
            height: parseFloat(formData.height) || 0,
            weight: parseFloat(formData.weight) || 0,
            is_premium: formData.isPremium ?? false, // Ensure it's not null
          },
        ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      // ✅ Process payment if user is premium
      if (formData.isPremium) {
        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
          throw new Error("Payment details are required for premium subscription.");
        }

        const { error: paymentError } = await supabase
          .from("payment_history")
          .insert([
            {
              user_id: authData.user.id,
              amount: 7.99,
              payment_method: "card",
              status: "completed",
            },
          ]);

        if (paymentError) {
          console.error("Payment processing error:", paymentError);
          throw new Error("Failed to process payment. Please try again.");
        }

        localStorage.setItem("isPremium", "true");
      }

      // ✅ Show success message
      toast({
        title: "Success!",
        description: `Your ${formData.isPremium ? "premium" : "free"} profile has been created.`,
      });

      // ✅ Refresh session & navigate user
      await supabase.auth.refreshSession();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate("/diary");
      } else {
        toast({
          variant: "default",
          title: "Check your email",
          description: "We've sent you a confirmation email. Please verify your email to complete registration.",
        });
        navigate("/auth");
      }

      return true;
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error instanceof Error ? error.message : "Failed to create profile");
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, toast, isSubmitting]);

  return {
    handleSignup,
    isSubmitting,
    error,
  };
}
