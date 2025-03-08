
import { useState, useCallback } from "react";
import { SignupFormData } from "./useSignup";

export function usePersonalInfoForm() {
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    nickname: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    isPremium: false,
    password: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);

  const handlePremiumToggle = useCallback((checked: boolean) => {
    if (!checked && !showPremiumDialog) {
      setShowPremiumDialog(true);
    }
    setFormData(prev => ({ ...prev, isPremium: checked }));
  }, [showPremiumDialog]);

  return {
    formData,
    setFormData,
    showPremiumDialog,
    setShowPremiumDialog,
    handleInputChange,
    handlePremiumToggle
  };
}
