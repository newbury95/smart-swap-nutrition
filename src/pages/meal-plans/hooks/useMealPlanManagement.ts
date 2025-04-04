
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MealPlan } from '@/components/food/types';
import { mockMealPlans } from '@/utils/mockData';

export const useMealPlanManagement = () => {
  const { toast } = useToast();
  const [shuffledMeals, setShuffledMeals] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const regenerateMealPlans = () => {
    try {
      setIsLoading(true);
      // Use a web worker or setTimeout to move this work off the main thread
      setTimeout(() => {
        const shuffled = mockMealPlans.map(plan => {
          const newPlan = { ...plan };
          newPlan.days = plan.days.map(day => ({
            ...day,
            breakfast: shuffleArray([...day.breakfast]),
            lunch: shuffleArray([...day.lunch]),
            dinner: shuffleArray([...day.dinner]),
            snacks: shuffleArray([...day.snacks]),
          }));
          
          const allFoods = newPlan.days.flatMap(day => [
            ...day.breakfast, 
            ...day.lunch, 
            ...day.dinner, 
            ...day.snacks
          ]);
          
          newPlan.calories = Math.round(allFoods.reduce((sum, food) => sum + food.calories, 0) / newPlan.days.length);
          newPlan.protein = Math.round(allFoods.reduce((sum, food) => sum + food.protein, 0) / newPlan.days.length);
          newPlan.carbs = Math.round(allFoods.reduce((sum, food) => sum + food.carbs, 0) / newPlan.days.length);
          newPlan.fat = Math.round(allFoods.reduce((sum, food) => sum + food.fat, 0) / newPlan.days.length);
          
          return newPlan;
        });
        
        setShuffledMeals(shuffled);
        setIsLoading(false);
      }, 0);
    } catch (error) {
      console.error("Error regenerating meal plans:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update meal plans. Please try again.",
      });
      setIsLoading(false);
    }
  };

  // Initialize with shuffled meal plans
  useEffect(() => {
    regenerateMealPlans();
  }, []);

  return {
    shuffledMeals,
    isLoading,
    regenerateMealPlans,
  };
};
