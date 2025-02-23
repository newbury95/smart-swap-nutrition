
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoForm } from "../types/PersonalInfo.types";
import { convertHeight, convertWeight } from "../utils/unitConversions";

export const createUserProfile = async (formData: PersonalInfoForm) => {
  console.log('Starting user creation process with formData:', formData);
  
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', formData.email)
      .single();

    if (existingUser) {
      console.error('User already exists:', existingUser);
      throw new Error('A user with this email already exists');
    }

    // Convert units to metric for storage if necessary
    const heightInCm = formData.heightUnit === "ft" 
      ? convertHeight(formData.height, "ft")
      : formData.height;
    
    const weightInKg = formData.weightUnit === "st"
      ? convertWeight(formData.weight, "st")
      : formData.weight;

    console.log('Converted measurements:', { heightInCm, weightInKg });

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
      console.error('No user data returned from signup');
      throw new Error('No user data returned from signup');
    }

    console.log('Auth user created:', signUpData.user.id);

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
        height: parseFloat(heightInCm),
        weight: parseFloat(weightInKg),
        is_premium: formData.isPremium
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(signUpData.user.id);
      throw profileError;
    }

    console.log('Profile created successfully');

    // Sign in to establish session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: "tempPassword123"
    });

    if (signInError) {
      console.error('Error signing in after signup:', signInError);
      throw signInError;
    }

    console.log('Sign in successful, session established');
    return signUpData.user;
    
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};
