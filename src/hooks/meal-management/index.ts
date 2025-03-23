
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useMealLoader } from "./useMealLoader";
import { useMealActions } from "./useMealActions";
import { useNutrientCalculations } from "./useNutrientCalculations";
import { MealType } from "./types";

export const useMealManagement = (date: Date) => {
  const { getMeals, addMeal, deleteMeal } = useSupabase();
  
  // Create stable date string to prevent unnecessary re-renders
  const formattedDate = date.toISOString().split('T')[0];
  
  const { 
    meals, 
    isLoading, 
    nutrients, 
    refreshMeals 
  } = useMealLoader(date, getMeals);
  
  const [mealsState, setMealsState] = useState(meals);
  const [nutrientsState, setNutrientsState] = useState(nutrients);
  
  // Update state when props change
  if (meals !== mealsState) {
    setMealsState(meals);
  }
  
  if (nutrients !== nutrientsState) {
    setNutrientsState(nutrients);
  }
  
  const { 
    handleAddFood, 
    handleDeleteFood 
  } = useMealActions({
    formattedDate,
    addMeal,
    deleteMeal,
    setMeals: setMealsState,
    setNutrients: setNutrientsState,
    meals: mealsState
  });
  
  const {
    getTotalNutrients,
    getAllMealsNutrients
  } = useNutrientCalculations(nutrientsState);

  return {
    meals: mealsState,
    isLoading,
    handleAddFood,
    handleDeleteFood,
    getTotalNutrients,
    getAllMealsNutrients,
    refreshMeals
  };
};

export type { MealType } from "./types";
export * from "./useMealLoader";
export * from "./useMealActions";
export * from "./useNutrientCalculations";
