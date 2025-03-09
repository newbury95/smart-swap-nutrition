
import { useState } from "react";
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

export default CheckoutForm;
