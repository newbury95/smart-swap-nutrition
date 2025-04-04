import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlanFeatureList from "./PlanFeatureList";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

interface PremiumPlanCardProps {
  features: string[];
}

const PremiumPlanCard = ({ features }: PremiumPlanCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  
  const handlePremiumClick = () => {
    if (user) {
      if (isPremium) {
        // Premium user - go to manage subscription
        navigate('/cancel-subscription');
      } else {
        // Existing user - redirect directly to Stripe
        window.open("https://buy.stripe.com/3cs7vfbo97269pudQQ", "_blank");
      }
    } else {
      // New user - go to auth page with premium flag
      navigate('/auth?tab=signup&premium=true');
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-soft-mint to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-primary-lighter"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">Premium</h3>
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-gray-600 mt-2">Unlock all features</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">£7.99</span>
          <p className="text-sm text-gray-500">/month</p>
        </div>
      </div>
      
      <PlanFeatureList features={features} />

      <button
        onClick={handlePremiumClick}
        className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
      >
        {isPremium ? "Manage Subscription" : user ? "Complete Payment" : "Get Premium"}
        <Crown className="w-4 h-4 text-amber-200" />
      </button>
    </motion.div>
  );
};

export default PremiumPlanCard;
