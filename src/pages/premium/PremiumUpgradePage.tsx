
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import CheckoutForm from "@/components/payment/CheckoutForm";

// Use environment variable or fallback to test key (should be configured properly in production)
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Qx8ZW2VssJgwMDKBMlrqlCvWJGssJw2DhQxKBYFetlue4dNUGESfKDVz9dOgThYSX1O4DvCWYAZIcQOWU8ebfF100JuLCHbao";

// Load stripe outside of component rendering to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// The appearance options for the Stripe elements
const appearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#22c55e',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    spacingUnit: '4px',
    borderRadius: '4px',
  },
};

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
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

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Benefits include:</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Personalized meal plans</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Advanced nutrition tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Premium workout plans</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Custom foods and recipes</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Health app integration (Apple Health & Samsung Health)</span>
              </li>
            </ul>
          </div>

          <Elements stripe={stripePromise} options={{ appearance }}>
            <CheckoutForm />
          </Elements>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumUpgradePage;
