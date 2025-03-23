
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Meal } from "@/hooks/types/supabase";
import { MealType, MealsByType, NutrientTotals } from "./types";

type MealActionsProps = {
  formattedDate: string;
  addMeal: (meal: any) => Promise<Meal | null>;
  deleteMeal: (mealId: string) => Promise<void>;
  setMeals: React.Dispatch<React.SetStateAction<MealsByType>>;
  setNutrients: React.Dispatch<React.SetStateAction<NutrientTotals>>;
  meals: MealsByType;
};

export const useMealActions = ({
  formattedDate,
  addMeal,
  deleteMeal,
  setMeals,
  setNutrients,
  meals
}: MealActionsProps) => {
  const { toast } = useToast();

  const handleAddFood = useCallback((type: MealType) => async (food: any) => {
    try {
      console.log('Adding food:', food); // Debug log
      const meal = await addMeal({
        food_name: food.name,
        calories: Math.round(food.calories || 0), // Round to whole number and ensure it's not NaN
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        meal_type: type,
        serving_size: food.servingSize || '1 serving',
        date: formattedDate,
      });

      if (meal) {
        // Update meals state
        setMeals(prev => {
          const updatedMeals = {
            ...prev,
            [type]: [...prev[type], meal]
          };
          return updatedMeals;
        });
        
        // Update nutrients separately after meals state is updated
        setNutrients(prev => ({
          calories: prev.calories + (meal.calories || 0),
          protein: prev.protein + (meal.protein || 0),
          carbs: prev.carbs + (meal.carbs || 0),
          fat: prev.fat + (meal.fat || 0)
        }));

        toast({
          title: "Food added",
          description: `${food.name} added to ${type}`,
        });
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food",
      });
    }
  }, [addMeal, formattedDate, toast, setMeals, setNutrients]);

  const handleDeleteFood = useCallback(async (type: MealType, mealId: string) => {
    try {
      // Find the meal we're about to delete to update nutrients correctly
      const mealToDelete = meals[type].find(meal => meal.id === mealId);
      
      await deleteMeal(mealId);
      
      // Update meals state
      setMeals(prev => {
        const updatedMeals = {
          ...prev,
          [type]: prev[type].filter(meal => meal.id !== mealId)
        };
        return updatedMeals;
      });
      
      // Update nutrients
      if (mealToDelete) {
        setNutrients(prev => ({
          calories: prev.calories - (mealToDelete.calories || 0),
          protein: prev.protein - (mealToDelete.protein || 0),
          carbs: prev.carbs - (mealToDelete.carbs || 0),
          fat: prev.fat - (mealToDelete.fat || 0)
        }));
      }

      toast({
        title: "Food removed",
        description: "Item has been removed from your diary",
      });
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove food",
      });
    }
  }, [deleteMeal, toast, meals, setMeals, setNutrients]);

  return {
    handleAddFood,
    handleDeleteFood
  };
};
