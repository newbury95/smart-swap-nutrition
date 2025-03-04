
import { motion } from "framer-motion";
import { SignupFormData } from "../hooks/useSignup";
import { useState } from "react";

interface PaymentSectionProps {
  isPremium: boolean;
  formData: Pick<SignupFormData, 'cardNumber' | 'expiryDate' | 'cvv'>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaymentSection = ({ isPremium, formData, handleInputChange }: PaymentSectionProps) => {
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    e.target.value = formattedValue.substring(0, 19); // Limit to 16 digits + spaces
    handleInputChange(e);
  };

  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += '/' + value.substring(2, 4);
      }
    }
    
    e.target.value = formattedValue;
    handleInputChange(e);
  };

  const validateCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value.substring(0, 3);
    handleInputChange(e);
  };

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
            onChange={formatCardNumber}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
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
              onChange={formatExpiryDate}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="MM/YY"
              maxLength={5}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
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
              onChange={validateCvv}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="123"
              maxLength={3}
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
