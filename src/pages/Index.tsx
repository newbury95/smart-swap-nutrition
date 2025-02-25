
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FreePlanCard from "@/components/pricing/FreePlanCard";
import PremiumPlanCard from "@/components/pricing/PremiumPlanCard";
import SponsorBanner from "@/components/sponsors/SponsorBanner";

const Index = () => {
  const navigate = useNavigate();

  const premiumFeatures = [
    "Personalized meal plans",
    "Advanced workout tracking",
    "Premium recipes library",
    "Expert nutrition consultation",
    "Progress analytics"
  ];

  const freeFeatures = [
    "Basic meal tracking",
    "Daily food diary",
    "Basic health metrics",
    "Community forum access",
    "Email support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      {/* Top Banner */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-green-600">NutriTrack</h1>
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-800">
            Track Your Nutrition Journey
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of health enthusiasts and achieve your fitness goals
            with personalized nutrition tracking.
          </p>
        </motion.div>

        {/* Pricing Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16"
        >
          <FreePlanCard features={freeFeatures} />
          <PremiumPlanCard features={premiumFeatures} />
        </motion.div>
      </section>

      <SponsorBanner />
    </div>
  );
};

export default Index;

