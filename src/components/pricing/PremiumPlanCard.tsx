
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlanFeatureList from "./PlanFeatureList";

interface PremiumPlanCardProps {
  features: string[];
}

const PremiumPlanCard = ({ features }: PremiumPlanCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-green-100"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">Premium</h3>
            <Crown className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-gray-600 mt-2">Unlock all features</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-green-600">£7.99</span>
          <p className="text-sm text-gray-500">/month</p>
        </div>
      </div>
      
      <PlanFeatureList features={features} />

      <button
        onClick={() => navigate('/signup')}
        className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        Get Premium
        <Crown className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default PremiumPlanCard;

