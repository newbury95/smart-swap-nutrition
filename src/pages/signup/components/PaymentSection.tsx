import { motion } from "framer-motion";
import { SignupFormData } from "../hooks/useSignup";

interface PaymentSectionProps {
  isPremium: boolean;
  formData: Pick<SignupFormData, 'cardNumber' | 'expiryDate' | 'cvv'>;
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
