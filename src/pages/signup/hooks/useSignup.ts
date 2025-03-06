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
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      if (!formData.recaptchaToken) {
        throw new Error("Please complete the reCAPTCHA verification");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            nickname: formData.nickname,
            date_of_birth: formData.dateOfBirth,
            height: formData.height,
            weight: formData.weight,
            is_premium: formData.isPremium
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user data returned from signup");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error('Profile verification error:', profileError);
        throw new Error("Failed to verify profile creation. Please try again.");
      }

      if (formData.isPremium) {
        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
          throw new Error("Payment details are required for premium subscription");
        }
        
        const { error: paymentError } = await supabase
          .from('payment_history')
          .insert([{
            user_id: authData.user.id,
            amount: 7.99,
            payment_method: 'card',
            status: 'completed'
          }]);
          
        if (paymentError) {
          console.error('Payment error:', paymentError);
          throw new Error("Failed to process payment. Please try again.");
        }
        
        localStorage.setItem('isPremium', 'true');
      }

      toast({
        title: "Success!",
        description: `Your ${formData.isPremium ? 'premium' : 'free'} profile has been created.`,
      });

      await supabase.auth.refreshSession();
      const { data: { session }} = await supabase.auth.getSession();
      
      if (session) {
        navigate("/diary");
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation email. Please verify your email to complete registration.",
        });
        navigate("/auth");
      }
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
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
    error
  };
}
