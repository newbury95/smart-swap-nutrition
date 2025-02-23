
import { useState, useEffect } from "react";
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

  useEffect(() => {
    loadMeals();
  }, [date]);

  const loadMeals = async () => {
    try {
      const fetchedMeals = await getMeals(date);
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
    }
  };

  const handleAddFood = (type: MealType) => async (food: any) => {
    try {
      const meal = await addMeal({
        food_name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        meal_type: type,
        serving_size: food.servingSize,
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
  };

  const handleDeleteFood = async (type: MealType, mealId: string) => {
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
  };

  const getTotalNutrients = (mealList: Meal[]) => {
    return mealList.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getAllMealsNutrients = () => {
    const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snack];
    return getTotalNutrients(allMeals);
  };

  return {
    meals,
    handleAddFood,
    handleDeleteFood,
    getAllMealsNutrients
  };
};

