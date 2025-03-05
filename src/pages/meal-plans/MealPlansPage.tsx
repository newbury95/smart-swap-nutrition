
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { MealPlan, Food } from '@/components/food/types';
import { mockMealPlans } from '@/utils/mockData';
import { useMealManagement } from '@/hooks/useMealManagement';
import Header from './components/Header';
import MealPlanCategoryTabs from './components/MealPlanCategoryTabs';
import MealPlanDetails from './components/MealPlanDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const MealPlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);
  const [shuffledMeals, setShuffledMeals] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const { handleAddFood } = useMealManagement(today);

  // Initialize with shuffled meal plans
  useEffect(() => {
    setIsLoading(true);
    try {
      // Simulate network delay for data loading
      const timer = setTimeout(() => {
        regenerateMealPlans();
        setIsLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error loading meal plans:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meal plans. Please try again.",
      });
    }
  }, []);

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Memoize the regeneration function to prevent unnecessary recalculations
  const regenerateMealPlans = () => {
    try {
      const shuffled = mockMealPlans.map(plan => {
        // Create a deep copy of the plan
        const newPlan = { ...plan };
        
        // Shuffle days for each plan to create variation
        newPlan.days = plan.days.map(day => {
          // For each day, shuffle the breakfast, lunch, dinner, and snacks arrays
          return {
            ...day,
            breakfast: shuffleArray([...day.breakfast]),
            lunch: shuffleArray([...day.lunch]),
            dinner: shuffleArray([...day.dinner]),
            snacks: shuffleArray([...day.snacks]),
          };
        });
        
        // Recalculate the nutritional totals based on the new meal combinations
        const allFoods = newPlan.days.flatMap(day => [
          ...day.breakfast, 
          ...day.lunch, 
          ...day.dinner, 
          ...day.snacks
        ]);
        
        // Calculate the average nutritional values across all days
        newPlan.calories = Math.round(allFoods.reduce((sum, food) => sum + food.calories, 0) / newPlan.days.length);
        newPlan.protein = Math.round(allFoods.reduce((sum, food) => sum + food.protein, 0) / newPlan.days.length);
        newPlan.carbs = Math.round(allFoods.reduce((sum, food) => sum + food.carbs, 0) / newPlan.days.length);
        newPlan.fat = Math.round(allFoods.reduce((sum, food) => sum + food.fat, 0) / newPlan.days.length);
        
        return newPlan;
      });
      
      setShuffledMeals(shuffled);
    } catch (error) {
      console.error("Error regenerating meal plans:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update meal plans. Please try again.",
      });
    }
  };

  const handleOpenMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowMealPlanDetails(true);
  };

  const handleAddToDiary = () => {
    if (selectedMealPlan) {
      try {
        toast({
          title: "Meal plan added to diary",
          description: `${selectedMealPlan.name} has been added to your food diary`,
        });
        setShowMealPlanDetails(false);
        navigate('/diary');
      } catch (error) {
        console.error("Error adding meal plan to diary:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add meal plan to diary. Please try again.",
        });
      }
    }
  };

  const handleAddSingleMeal = (meal: Food, mealType: string) => {
    try {
      let mealTypeForDiary: "breakfast" | "lunch" | "dinner" | "snack" = "snack";
      
      switch(mealType.toLowerCase()) {
        case "breakfast":
          mealTypeForDiary = "breakfast";
          break;
        case "lunch":
          mealTypeForDiary = "lunch";
          break;
        case "dinner":
          mealTypeForDiary = "dinner";
          break;
        default:
          mealTypeForDiary = "snack";
      }
      
      handleAddFood(mealTypeForDiary)({
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        servingSize: meal.servingSize,
      });
      
      toast({
        title: "Meal added to diary",
        description: `${meal.name} has been added to your ${mealTypeForDiary}`,
      });
    } catch (error) {
      console.error("Error adding meal to diary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add meal to diary. Please try again.",
      });
    }
  };

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-700">There was an error loading the meal plans. Please refresh the page.</div>}>
      <div className="min-h-screen bg-gray-50">
        <Header onRefresh={regenerateMealPlans} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : (
              <MealPlanCategoryTabs 
                shuffledMeals={shuffledMeals} 
                handleOpenMealPlan={handleOpenMealPlan} 
              />
            )}
          </div>
        </main>

        {/* Meal Plan Details Sheet */}
        <Sheet open={showMealPlanDetails} onOpenChange={setShowMealPlanDetails}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <MealPlanDetails 
              selectedMealPlan={selectedMealPlan}
              handleAddToDiary={handleAddToDiary}
              handleAddSingleMeal={handleAddSingleMeal}
            />
          </SheetContent>
        </Sheet>
      </div>
    </ErrorBoundary>
  );
};

export default MealPlansPage;
