
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { MealPlan, Food } from '@/components/food/types';
import { mockMealPlans } from '@/utils/mockData';
import { useMealManagement } from '@/hooks/useMealManagement';
import Header from './components/Header';
import MealPlanCategoryTabs from './components/MealPlanCategoryTabs';
import MealPlanDetails from './components/MealPlanDetails';

const MealPlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);
  const [shuffledMeals, setShuffledMeals] = useState<MealPlan[]>([]);
  const today = new Date();
  const { handleAddFood } = useMealManagement(today);

  // Initialize with shuffled meal plans
  useEffect(() => {
    regenerateMealPlans();
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

  // Regenerate meal plans with random meals
  const regenerateMealPlans = () => {
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
  };

  const handleOpenMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowMealPlanDetails(true);
  };

  const handleAddToDiary = () => {
    if (selectedMealPlan) {
      toast({
        title: "Meal plan added to diary",
        description: `${selectedMealPlan.name} has been added to your food diary`,
      });
      setShowMealPlanDetails(false);
      navigate('/diary');
    }
  };

  const handleAddSingleMeal = (meal: Food, mealType: string) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={regenerateMealPlans} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <MealPlanCategoryTabs 
            shuffledMeals={shuffledMeals} 
            handleOpenMealPlan={handleOpenMealPlan} 
          />
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
  );
};

export default MealPlansPage;
