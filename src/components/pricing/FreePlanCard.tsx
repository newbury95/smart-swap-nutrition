
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlanFeatureList from "./PlanFeatureList";

interface FreePlanCardProps {
  features: string[];
}

const FreePlanCard = ({ features }: FreePlanCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Free Plan</h3>
          <p className="text-gray-600 mt-2">Get started with the basics</p>
        </div>
        <span className="text-2xl font-bold text-gray-900">£0</span>
      </div>
      
      <PlanFeatureList features={features} />

      <button
        onClick={() => navigate('/auth?tab=signup')}
        className="w-full bg-primary-lighter text-primary-dark py-3 rounded-full hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
      >
        Try for Free
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default FreePlanCard;
