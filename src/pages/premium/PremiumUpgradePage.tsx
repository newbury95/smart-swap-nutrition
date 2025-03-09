import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentElementProps
} from "@stripe/react-stripe-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

// Use environment variable or fallback to test key (should be configured properly in production)
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Qx8ZW2VssJgwMDKBMlrqlCvWJGssJw2DhQxKBYFetlue4dNUGESfKDVz9dOgThYSX1O4DvCWYAZIcQOWU8ebfF100JuLCHbao";

// Load stripe outside of component rendering to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// The appearance options for the Stripe elements
const appearance = {
  theme: 'stripe' as const,  // Use literal type
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

// The form to collect payment details
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshPremiumStatus } = usePremiumStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get a reference to the CardElement
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // Create a payment method using the CardElement
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (stripeError) {
        throw stripeError;
      }
      
      // In a real implementation, you would call your backend API to process the payment
      // and create a subscription with Stripe. For this demo, we'll just simulate success.
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert([{
          user_id: user.id,
          amount: 7.99,
          status: 'completed',
          payment_method: 'card',
          payment_method_id: paymentMethod.id
        }]);
        
      if (paymentError) {
        console.error('Payment record error:', paymentError);
        throw paymentError;
      }
      
      // Update user's premium status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Premium status update error:', updateError);
        throw updateError;
      }
      
      // Refresh the premium status
      await refreshPremiumStatus();
      
      toast({
        title: "Success!",
        description: "Your account has been upgraded to premium!",
      });
      
      navigate("/diary");
    } catch (error: any) {
      console.error('Upgrade error:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process payment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="p-4 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {loading ? "Processing..." : "Pay £7.99/month"}
      </Button>
    </form>
  );
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
