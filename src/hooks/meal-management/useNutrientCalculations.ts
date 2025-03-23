
import { useCallback } from "react";
import { Meal } from "@/hooks/types/supabase";
import { NutrientTotals } from "./types";

export const useNutrientCalculations = (nutrients: NutrientTotals) => {
  const getTotalNutrients = useCallback((mealList: Meal[]) => {
    return mealList.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, []);

  // Use the pre-calculated nutrients instead of recalculating on every render
  const getAllMealsNutrients = useCallback(() => {
    return nutrients;
  }, [nutrients]);

  return {
    getTotalNutrients,
    getAllMealsNutrients
  };
};
