
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MealPlan } from '@/components/food/types';
import { useMealManagement } from '@/hooks/useMealManagement';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import Header from './components/Header';
import MealPlanCategoryTabs from './components/MealPlanCategoryTabs';
import MealPlanDetails from './components/MealPlanDetails';
import { useMealPlanManagement } from './hooks/useMealPlanManagement';
import { MealPlanProvider, useMealPlanContext } from './context/MealPlanContext';
import { MealPlanActions } from './components/MealPlanActions';

const MealPlansPageContent = () => {
  const today = new Date();
  const { handleAddFood } = useMealManagement(today);
  const { shuffledMeals, isLoading, regenerateMealPlans } = useMealPlanManagement();
  const { 
    selectedMealPlan, 
    setSelectedMealPlan,
    showMealPlanDetails,
    setShowMealPlanDetails 
  } = useMealPlanContext();
  
  const { handleAddToDiary, handleAddSingleMeal } = MealPlanActions({ handleAddFood });

  const handleOpenMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowMealPlanDetails(true);
  };

  return (
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

const MealPlansPage = () => {
  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-700">There was an error loading the meal plans. Please refresh the page.</div>}>
      <MealPlanProvider>
        <MealPlansPageContent />
      </MealPlanProvider>
    </ErrorBoundary>
  );
};

export default MealPlansPage;
