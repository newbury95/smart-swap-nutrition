
import { useState, useCallback } from "react";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshPremiumStatus } = usePremiumStatus();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Stripe has not loaded properly. Please try again.",
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to complete this purchase.",
      });
      navigate("/auth");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get a reference to the CardElement
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Payment form not found');
      }
      
      // Create a payment method using the CardElement
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (stripeError) {
        throw stripeError;
      }
      
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
        throw new Error(`Failed to save payment: ${paymentError.message}`);
      }
      
      // Update user's premium status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Premium status update error:', updateError);
        throw new Error(`Failed to update premium status: ${updateError.message}`);
      }
      
      // Refresh the premium status
      await refreshPremiumStatus();
      
      // Clear the card element
      cardElement.clear();
      
      toast({
        title: "Success!",
        description: "Your account has been upgraded to premium!",
      });
      
      navigate("/diary");
    } catch (error: any) {
      console.error('Upgrade error:', error);
      setError(error.message || "An unknown error occurred during payment processing");
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [stripe, elements, user, toast, navigate, refreshPremiumStatus]);
  
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
      
      <p className="text-xs text-center text-gray-500 mt-2">
        Your card will be charged immediately. You can cancel anytime.
      </p>
    </form>
  );
};

export default CheckoutForm;
