
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MealPlan, Food } from '@/components/food/types';
import { mockMealPlans } from '@/utils/mockData';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import MealPlansHeader from './components/MealPlansHeader';
import MealPlanCategoryTabs from '../meal-plans/components/MealPlanCategoryTabs';
import MealPlanDetails from '../meal-plans/components/MealPlanDetails';

const MealPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);

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
    toast({
      title: `${mealType} Added`,
      description: `${meal.name} has been added to your food diary`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-green-600">Meal Plans</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Choose Your Meal Plan</h2>
          
          <MealPlanCategoryTabs 
            shuffledMeals={mockMealPlans} 
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

export default MealPlans;
