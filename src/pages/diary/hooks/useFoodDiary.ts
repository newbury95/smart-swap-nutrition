
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Meal, MealType } from "../types";

export const useFoodDiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, hasProfile, isLoading, checkingProfile } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [meals, setMeals] = useState<Record<MealType, Meal[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [showSwaps, setShowSwaps] = useState(false);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  useEffect(() => {
    console.log('[FoodDiary] Auth state:', {
      hasSession: !!session,
      hasProfile,
      isLoading,
      checkingProfile
    });

    if (!isLoading && !checkingProfile) {
      if (!session) {
        console.log('[FoodDiary] No session, redirecting to signup');
        navigate('/signup');
        return;
      }

      if (hasProfile === false) {
        console.log('[FoodDiary] No profile found, redirecting to personal info');
        navigate('/signup/personal-info');
        return;
      }

      setIsLoadingMeals(false);
    }
  }, [session, hasProfile, isLoading, checkingProfile, navigate]);

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

  const handleAddFood = (type: MealType) => (food: any) => {
    console.log('[FoodDiary] Adding food to', type, ':', food);
    const newMeal: Meal = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
    };

    setMeals(prev => ({
      ...prev,
      [type]: [...prev[type], newMeal]
    }));

    toast({
      title: "Food added",
      description: `${food.name} added to ${type}`,
    });
  };

  const handleDeleteFood = (type: MealType, mealId: string) => {
    console.log('[FoodDiary] Deleting food from', type, 'with id:', mealId);
    setMeals(prev => ({
      ...prev,
      [type]: prev[type].filter(meal => meal.id !== mealId)
    }));

    toast({
      title: "Food removed",
      description: "Item has been removed from your diary",
    });
  };

  const handleComplete = () => {
    console.log('[FoodDiary] Completing daily food diary');
    setShowSwaps(true);
    toast({
      title: "Daily food diary completed",
      description: "Here are some suggested food swaps based on your goals",
    });
  };

  return {
    date,
    setDate,
    meals,
    showSwaps,
    setShowSwaps,
    isLoading: isLoadingMeals || isLoading || checkingProfile,
    handleAddFood,
    handleDeleteFood,
    handleComplete,
    getAllMealsNutrients
  };
};
