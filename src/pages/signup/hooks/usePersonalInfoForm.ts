
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
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    isPremium: false,
  });

  const convertHeight = (value: string, from: "cm" | "ft"): string => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (from === "cm") {
      return (numValue / 30.48).toFixed(2); // Convert cm to feet
    } else {
      return Math.round(numValue * 30.48).toString(); // Convert feet to cm
    }
  };

  const convertWeight = (value: string, from: "kg" | "st"): string => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (from === "kg") {
      return (numValue / 6.35029318).toFixed(2); // Convert kg to stone
    } else {
      return (numValue * 6.35029318).toFixed(1); // Convert stone to kg
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleUnitToggle = (type: "height" | "weight") => {
    if (type === "height") {
      const newUnit = formData.heightUnit === "cm" ? "ft" : "cm";
      const newHeight = convertHeight(formData.height, formData.heightUnit);
      setFormData(prev => ({
        ...prev,
        heightUnit: newUnit,
        height: newHeight
      }));
    } else {
      const newUnit = formData.weightUnit === "kg" ? "st" : "kg";
      const newWeight = convertWeight(formData.weight, formData.weightUnit);
      setFormData(prev => ({
        ...prev,
        weightUnit: newUnit,
        weight: newWeight
      }));
    }
  };

  const handlePremiumToggle = (checked: boolean) => {
    if (!checked && formData.isPremium) {
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
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        throw new Error('A user with this email already exists');
      }

      // Convert units to metric for storage if necessary
      const heightInCm = formData.heightUnit === "ft" 
        ? parseFloat(convertHeight(formData.height, "ft"))
        : parseFloat(formData.height);
      
      const weightInKg = formData.weightUnit === "st"
        ? parseFloat(convertWeight(formData.weight, "st"))
        : parseFloat(formData.weight);

      // Create auth user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: "tempPassword123",
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
          height: heightInCm,
          weight: weightInKg,
          is_premium: formData.isPremium
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      // Explicitly sign in with password after signup
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: "tempPassword123"
      });

      if (signInError) {
        console.error('Error signing in after signup:', signInError);
        throw signInError;
      }

      if (!signInData.session) {
        throw new Error('Failed to establish session after sign in');
      }

      console.log('Session established successfully:', signInData.session.user.id);

      // Verify session is active
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session verification failed');
      }

      console.log('Session verified, navigating to diary');
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
    handleUnitToggle,
    handleSubmit,
    convertHeight,
    convertWeight
  };
};
