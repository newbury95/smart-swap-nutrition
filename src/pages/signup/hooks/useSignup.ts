
import { useState } from "react";
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
}

export function useSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProfile = async (userId: string, formData: SignupFormData) => {
    try {
      console.log("Creating profile with user ID:", userId);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          nickname: formData.nickname,
          date_of_birth: formData.dateOfBirth,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          is_premium: formData.isPremium
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create profile: ${JSON.stringify(profileError)}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error in createProfile:", error);
      throw error;
    }
  };

  const handleSignup = async (formData: SignupFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Starting signup process with data:", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      // Ensure we have a password
      if (!formData.password) {
        throw new Error("Password is required");
      }

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('No user data returned from signup');
        throw new Error("No user data returned from signup");
      }

      console.log("Auth success, user ID:", authData.user.id);
      
      // Implement a retry mechanism for profile creation
      let retryCount = 0;
      const maxRetries = 3;
      let profileCreated = false;
      
      while (!profileCreated && retryCount < maxRetries) {
        try {
          // Wait an increasing amount of time between retries
          const delay = 2000 * (retryCount + 1);
          console.log(`Attempt ${retryCount + 1}: Waiting ${delay}ms before creating profile...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Try to create the profile
          await createProfile(authData.user.id, formData);
          profileCreated = true;
          console.log("Profile created successfully!");
        } catch (error) {
          retryCount++;
          console.error(`Profile creation attempt ${retryCount} failed:`, error);
          
          if (retryCount >= maxRetries) {
            throw new Error(`Failed to create profile after ${maxRetries} attempts`);
          }
        }
      }

      toast({
        title: "Success!",
        description: `Your ${formData.isPremium ? 'premium' : 'free'} profile has been created.`,
      });
      
      // Store that the user has premium in localStorage (for demo purposes)
      if (formData.isPremium) {
        localStorage.setItem('isPremium', 'true');
      }
      
      navigate("/diary");
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSignup,
    isSubmitting
  };
}
