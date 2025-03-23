
import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Meal } from "@/hooks/types/supabase";
import { MealType, MealsByType, NutrientTotals } from "./types";

export const useMealLoader = (
  date: Date,
  getMeals: (date: Date) => Promise<Meal[]>
) => {
  const { toast } = useToast();
  const [meals, setMeals] = useState<MealsByType>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [nutrients, setNutrients] = useState<NutrientTotals>({ 
    calories: 0, 
    protein: 0, 
    carbs: 0, 
    fat: 0 
  });
  
  // Create stable date string for dependency to prevent infinite renders
  const formattedDate = date.toISOString().split('T')[0];
  const isInitialMount = useRef(true);

  // Load meals when date changes
  const loadMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedMeals = await getMeals(date);
      console.log('Fetched meals for date:', formattedDate, fetchedMeals);
      
      // Initialize with empty arrays for all meal types
      const initializedMeals = { 
        breakfast: [], 
        lunch: [], 
        dinner: [], 
        snack: [] 
      } as MealsByType;
      
      // Only process valid meals data
      if (Array.isArray(fetchedMeals)) {
        // Categorize meals by type
        fetchedMeals.forEach(meal => {
          const mealType = meal.meal_type as MealType;
          if (initializedMeals[mealType]) {
            initializedMeals[mealType].push(meal);
          } else {
            console.warn(`Unknown meal type: ${mealType}`);
          }
        });
      } else {
        console.warn('Fetched meals is not an array:', fetchedMeals);
      }
      
      setMeals(initializedMeals);
      
      // Calculate total nutrients here to avoid calculation on every render
      const allMeals = [...initializedMeals.breakfast, ...initializedMeals.lunch, 
                         ...initializedMeals.dinner, ...initializedMeals.snack];
      
      const totals = allMeals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      setNutrients(totals);
      console.log('Total nutrients calculated once:', totals);
    } catch (error) {
      console.error('Error loading meals:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meals",
      });
      // Still set empty meal structure on error
      setMeals({ breakfast: [], lunch: [], dinner: [], snack: [] });
      setNutrients({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [formattedDate, getMeals, toast]);

  useEffect(() => {
    // Only call loadMeals on initial mount and when formattedDate changes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadMeals();
    } else {
      loadMeals();
    }
  }, [formattedDate, loadMeals]);

  return {
    meals,
    isLoading,
    nutrients,
    refreshMeals: loadMeals
  };
};
