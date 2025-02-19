
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  height: number;
  weight: number;
  isMetric: boolean;
  isPremium: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    email: "",
    nickname: "",
    height: 0,
    weight: 0,
    isMetric: true,
    isPremium: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePremiumToggle = (checked: boolean) => {
    if (!checked && !showPremiumDialog) {
      setShowPremiumDialog(true);
    }
    setFormData(prev => ({ ...prev, isPremium: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: `Your ${formData.isPremium ? 'premium' : 'free'} profile has been created.`,
    });
    navigate("/diary");
  };

  const premiumFeatures = [
    "Personalized meal plans",
    "Advanced nutrition tracking",
    "Expert consultation access",
    "Premium recipes library",
    "Progress analytics",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Personal Information
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Help us personalize your experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
              </label>
              <input
                type="text"
                name="nickname"
                required
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Membership Plan</h3>
                  <p className="text-sm text-gray-500">Choose between our free and premium plans</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Free</span>
                  <Switch
                    checked={formData.isPremium}
                    onCheckedChange={handlePremiumToggle}
                  />
                  <span className="text-sm font-medium text-green-600">Premium £7.99/mo</span>
                </div>
              </div>
            </div>

            {formData.isPremium && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required={formData.isPremium}
                      value={formData.cardNumber || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        required={formData.isPremium}
                        value={formData.expiryDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        required={formData.isPremium}
                        value={formData.cvv || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <button 
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock Premium Benefits</DialogTitle>
            <DialogDescription>
              Upgrade to our premium plan for just £7.99/month and get access to:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPremiumDialog(false)}
              className="sm:w-full"
            >
              Continue with Free Plan
            </Button>
            <Button
              onClick={() => {
                setFormData(prev => ({ ...prev, isPremium: true }));
                setShowPremiumDialog(false);
              }}
              className="sm:w-full bg-green-600 hover:bg-green-700"
            >
              Upgrade to Premium
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalInfo;
