
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const PremiumUpgradePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert([{
          user_id: userId,
          amount: 7.99,
          status: 'completed',
          payment_method: 'card',
        }]);

      if (paymentError) throw paymentError;

      // Update user's premium status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Your account has been upgraded to premium!",
      });

      navigate("/diary");
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
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
            </ul>
          </div>

          <form onSubmit={handleUpgrade} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <Input
                  type="text"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <Input
                    type="text"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <Input
                    type="text"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Pay £7.99/month"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumUpgradePage;

