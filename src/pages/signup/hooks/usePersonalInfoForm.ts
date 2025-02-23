
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
    }
    setFormData(prev => ({ ...prev, isPremium: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Starting form submission with data:', formData);

    try {
      console.log('Attempting to sign up user with email:', formData.email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "tempPassword123",
        options: {
          emailRedirectTo: window.location.origin + '/diary',
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) {
        console.error('Auth error during signup:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('No user data returned from signup');
        throw new Error("No user data returned");
      }

      console.log('User created successfully:', authData.user.id);

      const { data: { subscription } } = await supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, 'Session:', session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, creating profile...');
          
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
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
              throw profileError;
            }

            console.log('Profile created successfully');
            toast({
              title: "Success!",
              description: `Your ${formData.isPremium ? 'premium' : 'free'} profile has been created.`,
            });

            subscription.unsubscribe();
            navigate("/diary");
          } catch (error) {
            console.error('Error in profile creation:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to create profile",
            });
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Account created!",
        description: "Please wait while we set up your profile...",
      });

    } catch (error) {
      console.error('Detailed error during signup process:', error);
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
    isLoading,
    showPremiumDialog,
    setShowPremiumDialog,
    handleInputChange,
    handlePremiumToggle,
    handleSubmit
  };
};
