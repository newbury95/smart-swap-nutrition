
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoForm } from "../types/PersonalInfo.types";
import { convertHeight, convertWeight } from "../utils/unitConversions";

export const createUserProfile = async (formData: PersonalInfoForm) => {
  // Check if user exists
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

  // Create auth user with email and temp password
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: "tempPassword123", // We'll implement password reset flow later
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

  // Sign in to establish session
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: "tempPassword123"
  });

  if (signInError) {
    console.error('Error signing in after signup:', signInError);
    throw signInError;
  }

  return signUpData.user;
};
