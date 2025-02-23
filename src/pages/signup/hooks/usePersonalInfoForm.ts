
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoForm } from "../types/PersonalInfo.types";

export const usePersonalInfoForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    email: "",
    nickname: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    isPremium: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePremiumToggle = (checked: boolean) => {
    if (!checked && !showPremiumDialog) {
      setShowPremiumDialog(true);
      return;
    }
    setFormData(prev => ({ ...prev, isPremium: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Starting form submission with data:', formData);

    try {
      // First check if user exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        throw new Error('A user with this email already exists');
      }

      // Generate a random password for the initial signup
      const password = Math.random().toString(36).slice(-12);

      // Create auth user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (signUpError) {
        console.error('Error during signup:', signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('No user data returned from signup');
      }

      console.log('User created successfully:', signUpData.user.id);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user.id,
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
        console.error('Error creating profile:', profileError);
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password
      });

      if (signInError) {
        console.error('Error signing in after signup:', signInError);
        throw signInError;
      }

      if (!signInData.session) {
        throw new Error('Failed to establish session after sign in');
      }

      console.log('Session established successfully:', signInData.session.user.id);

      toast({
        title: "Success!",
        description: `Your ${formData.isPremium ? 'premium' : 'free'} profile has been created.`,
      });

      // Navigate to diary page
      navigate('/diary');

    } catch (error) {
      console.error('Error during signup process:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    showPremiumDialog,
    setShowPremiumDialog,
    handleInputChange,
    handlePremiumToggle,
    handleSubmit
  };
};
