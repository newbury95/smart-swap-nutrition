
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { PaymentSection } from "./components/PaymentSection";
import { PremiumDialog } from "./components/PremiumDialog";
import { usePersonalInfoForm } from "./hooks/usePersonalInfoForm";
import { useSignup } from "./hooks/useSignup";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { 
    formData, 
    setFormData,
    showPremiumDialog, 
    setShowPremiumDialog, 
    handleInputChange, 
    handlePremiumToggle 
  } = usePersonalInfoForm();
  
  const { handleSignup, isSubmitting } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignup(formData);
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
