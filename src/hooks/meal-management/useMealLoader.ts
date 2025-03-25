
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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load meals when date changes
  const loadMeals = useCallback(async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    try {
      console.log('Fetching meals for date:', formattedDate);
      const fetchedMeals = await getMeals(date);
      
      // Check if the request was aborted
      if (abortControllerRef.current.signal.aborted) {
        console.log('Meal fetch aborted for:', formattedDate);
        return;
      }
      
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
      const allMeals = [
        ...initializedMeals.breakfast, 
        ...initializedMeals.lunch, 
        ...initializedMeals.dinner, 
        ...initializedMeals.snack
      ];
      
      const totals = allMeals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      setNutrients(totals);
    } catch (error) {
      // Only show error if the request wasn't aborted
      if (error.name !== 'AbortError') {
        console.error('Error loading meals:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load meals",
        });
      }
      // Still set empty meal structure on error
      setMeals({ breakfast: [], lunch: [], dinner: [], snack: [] });
      setNutrients({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [formattedDate, getMeals, toast]);

  useEffect(() => {
    loadMeals();
    
    // Cleanup function to abort any in-flight request when component unmounts
    // or when date changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [formattedDate, loadMeals]);

  return {
    meals,
    isLoading,
    nutrients,
    refreshMeals: loadMeals
  };
};
