
import { useState, useEffect } from "react";
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
}

const PersonalInfo = () => {
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
      // First sign up the user
      console.log('Attempting to sign up user with email:', formData.email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "tempPassword123", // You should add a password field to your form
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

      // Set up listener for auth state changes
      const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
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

            // Clean up listener and navigate
            authListener.subscription.unsubscribe();
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

      // Wait for a short time to ensure the listener is set up
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

  // Verify session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('User already has a session, redirecting to diary');
        navigate('/diary');
      }
    };
    checkSession();
  }, [navigate]);

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

            <PaymentSection
              isPremium={formData.isPremium}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <div className="mt-8 text-center">
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Profile..." : "Create Profile"}
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
