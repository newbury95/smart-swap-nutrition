
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [nutrients, setNutrients] = useState({ 
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
      } as Record<MealType, Meal[]>;
      
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
  }, [addMeal, formattedDate, toast]);

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
  }, [deleteMeal, toast, meals]);

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
    meals,
    isLoading,
    handleAddFood,
    handleDeleteFood,
    getTotalNutrients,
    getAllMealsNutrients,
    refreshMeals: loadMeals
  };
};
