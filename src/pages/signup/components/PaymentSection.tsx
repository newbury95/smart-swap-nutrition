
import { motion } from "framer-motion";

interface PaymentSectionProps {
  isPremium: boolean;
  formData: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaymentSection = ({ isPremium, formData, handleInputChange }: PaymentSectionProps) => {
  if (!isPremium) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-gray-200 pt-6"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
      
      {/* Payment Method Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="flex-1 py-3 px-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <img src="/apple-pay.svg" alt="Apple Pay" className="h-8 mx-auto" />
        </button>
        <button className="flex-1 py-3 px-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <img src="/google-pay.svg" alt="Google Pay" className="h-8 mx-auto" />
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or pay with card</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            required={isPremium}
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
              required={isPremium}
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
              required={isPremium}
              value={formData.cvv || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="123"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
