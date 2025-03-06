
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Food } from '@/components/food/types';
import { useMealPlanContext } from '../context/MealPlanContext';

interface MealPlanActionsProps {
  handleAddFood: (type: string) => (food: Food) => void;
}

export const useMealPlanActions = ({ handleAddFood }: MealPlanActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedMealPlan, setShowMealPlanDetails } = useMealPlanContext();

  const handleAddToDiary = () => {
    if (selectedMealPlan) {
      try {
        toast({
          title: "Meal plan added to diary",
          description: `${selectedMealPlan.name} has been added to your food diary`,
        });
        setShowMealPlanDetails(false);
        navigate('/diary');
      } catch (error) {
        console.error("Error adding meal plan to diary:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add meal plan to diary. Please try again.",
        });
      }
    }
  };

  const handleAddSingleMeal = (meal: Food, mealType: string) => {
    try {
      let mealTypeForDiary: "breakfast" | "lunch" | "dinner" | "snack" = "snack";
      
      switch(mealType.toLowerCase()) {
        case "breakfast":
          mealTypeForDiary = "breakfast";
          break;
        case "lunch":
          mealTypeForDiary = "lunch";
          break;
        case "dinner":
          mealTypeForDiary = "dinner";
          break;
        default:
          mealTypeForDiary = "snack";
      }
      
      handleAddFood(mealTypeForDiary)(meal);
      
      toast({
        title: "Meal added to diary",
        description: `${meal.name} has been added to your ${mealTypeForDiary}`,
      });
    } catch (error) {
      console.error("Error adding meal to diary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add meal to diary. Please try again.",
      });
    }
  };

  return {
    handleAddToDiary,
    handleAddSingleMeal,
  };
};
