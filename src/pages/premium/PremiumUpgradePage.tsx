
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { PageSpinner } from "@/components/ui/spinner";
import PremiumBenefits from "./components/PremiumBenefits";
import StripeConfig from "./components/StripeConfig";

const PremiumUpgradePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { isPremium } = usePremiumStatus();

  // Redirect already premium users to diary
  useEffect(() => {
    if (!loading && isPremium) {
      navigate('/diary');
    }
  }, [loading, isPremium, navigate]);

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=premium');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <PageSpinner />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-semibold">Upgrade to Premium</h1>
          </div>

          <PremiumBenefits />
          <StripeConfig />
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumUpgradePage;
