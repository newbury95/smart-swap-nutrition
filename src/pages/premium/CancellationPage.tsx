
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

const CancellationPage = () => {
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshPremiumStatus } = usePremiumStatus();

  const handleCancel = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You need to be logged in to cancel your subscription.",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      // Update premium status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('id', user.id);
        
      if (updateError) {
        throw new Error(`Failed to update premium status: ${updateError.message}`);
      }

      // Log cancellation in payment history
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert([{
          user_id: user.id,
          amount: 0, // No charge for cancellation
          status: 'cancelled',
          payment_method: 'card',
          payment_method_id: 'subscription_cancelled'
        }]);
        
      if (paymentError) {
        console.error('Payment record error:', paymentError);
        // Non-blocking error - we'll still show cancellation success
      }
      
      // Refresh premium status
      await refreshPremiumStatus();
      
      // Show success
      setCancelled(true);
      toast({
        title: "Subscription Cancelled",
        description: "Your premium subscription has been cancelled. You will not be charged again.",
      });
    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription. Please try again or contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-semibold">Cancel Premium Subscription</h1>
          </div>

          {!cancelled ? (
            <>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-2">Are you sure you want to cancel?</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Cancelling your subscription will:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-2">
                        <li>Stop future payments</li>
                        <li>Remove access to premium features</li>
                        <li>End your subscription at the end of your current billing period</li>
                      </ul>
                      <p className="text-sm text-gray-600">
                        You can resubscribe at any time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => navigate("/diary")}
                  disabled={loading}
                >
                  Keep Subscription
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {loading ? <Spinner size="sm" /> : "Cancel Subscription"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Subscription Cancelled</h3>
              <p className="text-gray-600 mb-6">
                Your subscription has been cancelled. You will have access to premium features until the end of your current billing period.
              </p>
              <Button onClick={() => navigate("/diary")}>
                Return to Food Diary
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationPage;
