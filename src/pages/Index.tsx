
import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components with meaningful chunk names
const FreePlanCard = lazy(() => import("@/components/pricing/FreePlanCard"));
const PremiumPlanCard = lazy(() => import("@/components/pricing/PremiumPlanCard"));

// Loading placeholder for lazy-loaded components
const CardPlaceholder = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-[380px]">
    <Skeleton className="h-7 w-3/4 mb-4" />
    <Skeleton className="h-4 w-1/2 mb-6" />
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/diary");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    // Only start loading animation after session check
    if (sessionChecked) {
      // Shorter loading time - just enough for a smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [sessionChecked]);

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
        duration: 0.4,
        ease: "easeOut"
      } 
    }
  };
  
  if (isLoading) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-lighter/10 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-4 pb-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerAnimation}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-5 text-center bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent"
            variants={itemAnimation}
          >
            Track Your Nutrition Journey
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-5"
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
          className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto mt-6"
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
