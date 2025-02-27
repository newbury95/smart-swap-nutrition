
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Lazy load components for better code splitting
const FreePlanCard = lazy(() => import("@/components/pricing/FreePlanCard"));
const PremiumPlanCard = lazy(() => import("@/components/pricing/PremiumPlanCard"));

// Loading placeholder for lazy-loaded components
const CardPlaceholder = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-[450px] animate-pulse">
    <div className="h-7 w-3/4 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  // Memoize these values to prevent unnecessary re-renders
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

  // Optimize animations for better performance
  const staggerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    }
  };

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
          initial="hidden"
          animate="visible"
          variants={staggerAnimation}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-green-800"
            variants={itemAnimation}
          >
            Track Your Nutrition Journey
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-8"
            variants={itemAnimation}
          >
            Join our community of health enthusiasts and achieve your fitness goals
            with personalized nutrition tracking.
          </motion.p>
        </motion.div>

        {/* Pricing Tiles */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerAnimation}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16"
        >
          <motion.div variants={itemAnimation}>
            <Suspense fallback={<CardPlaceholder />}>
              <FreePlanCard features={freeFeatures} />
            </Suspense>
          </motion.div>
          <motion.div variants={itemAnimation}>
            <Suspense fallback={<CardPlaceholder />}>
              <PremiumPlanCard features={premiumFeatures} />
            </Suspense>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
