
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, type Meal } from "@/hooks/useSupabase";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const useMealManagement = (date: Date) => {
  const { toast } = useToast();
  const { getMeals, addMeal, deleteMeal } = useSupabase();
  const [meals, setMeals] = useState<Record<MealType, Meal[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load meals when date changes
  const loadMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedMeals = await getMeals(date);
      console.log('Fetched meals for date:', date, fetchedMeals);
      
      const categorizedMeals = fetchedMeals.reduce((acc, meal) => ({
        ...acc,
        [meal.meal_type]: [...(acc[meal.meal_type as MealType] || []), meal]
      }), { breakfast: [], lunch: [], dinner: [], snack: [] } as Record<MealType, Meal[]>);
      
      setMeals(categorizedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meals",
      });
    } finally {
      setIsLoading(false);
    }
  }, [date, getMeals, toast]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

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
        date: date.toISOString().split('T')[0],
      });

      if (meal) {
        setMeals(prev => ({
          ...prev,
          [type]: [...prev[type], meal]
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
  }, [addMeal, date, toast]);

  const handleDeleteFood = useCallback(async (type: MealType, mealId: string) => {
    try {
      await deleteMeal(mealId);
      setMeals(prev => ({
        ...prev,
        [type]: prev[type].filter(meal => meal.id !== mealId)
      }));

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
  }, [deleteMeal, toast]);

  const getTotalNutrients = useCallback((mealList: Meal[]) => {
    return mealList.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, []);

  const getAllMealsNutrients = useCallback(() => {
    const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snack];
    const totals = getTotalNutrients(allMeals);
    console.log('Total nutrients from all meals:', totals);
    return totals;
  }, [meals, getTotalNutrients]);

  return {
    meals,
    isLoading,
    handleAddFood,
    handleDeleteFood,
    getTotalNutrients,
    getAllMealsNutrients,
    refreshMeals: loadMeals
  };
};
