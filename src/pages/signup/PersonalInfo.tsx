
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { PaymentSection } from "./components/PaymentSection";
import { PremiumDialog } from "./components/PremiumDialog";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfoForm {
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

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    email: "",
    nickname: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    isPremium: false,
    password: "",
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

  const createProfile = async (userId: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          await createProfile(authData.user.id);
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
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Personal Information
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Help us personalize your experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              handlePremiumToggle={handlePremiumToggle}
            />

            {formData.isPremium && (
              <PaymentSection
                isPremium={formData.isPremium}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}

            <div className="mt-8 text-center">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        onUpgrade={() => {
          setFormData(prev => ({ ...prev, isPremium: true }));
          setShowPremiumDialog(false);
        }}
      />
    </div>
  );
};

export default PersonalInfo;
