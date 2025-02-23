
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoForm } from "../types/PersonalInfo.types";
import { convertHeight, convertWeight } from "../utils/unitConversions";
import { createUserProfile } from "../services/signupService";

export const usePersonalInfoForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    email: "",
    nickname: "",
    dateOfBirth: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    isPremium: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleUnitToggle = (type: "height" | "weight") => {
    if (type === "height") {
      const newUnit = formData.heightUnit === "cm" ? "ft" : "cm";
      const newHeight = convertHeight(formData.height, formData.heightUnit);
      setFormData(prev => ({
        ...prev,
        heightUnit: newUnit,
        height: newHeight
      }));
    } else {
      const newUnit = formData.weightUnit === "kg" ? "st" : "kg";
      const newWeight = convertWeight(formData.weight, formData.weightUnit);
      setFormData(prev => ({
        ...prev,
        weightUnit: newUnit,
        weight: newWeight
      }));
    }
  };

  const handlePremiumToggle = (checked: boolean) => {
    if (!checked && formData.isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    setFormData(prev => ({ ...prev, isPremium: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Starting form submission with data:', formData);

    try {
      await createUserProfile(formData);
      
      toast({
        title: "Success!",
        description: `Your ${formData.isPremium ? 'premium' : 'free'} profile has been created.`,
      });

      navigate('/diary');

    } catch (error) {
      console.error('Error during signup process:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    showPremiumDialog,
    setShowPremiumDialog,
    handleInputChange,
    handlePremiumToggle,
    handleUnitToggle,
    handleSubmit,
    convertHeight,
    convertWeight
  };
};
