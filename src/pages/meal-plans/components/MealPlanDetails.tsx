
import React from 'react';
import { MealPlan, Food } from '@/components/food/types';
import MealPlanDetailsView from './MealPlanDetailsView';

interface MealPlanDetailsProps {
  selectedMealPlan: MealPlan | null;
  handleAddToDiary: () => void;
  handleAddSingleMeal: (meal: Food, mealType: string) => void;
}

const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({ 
  selectedMealPlan, 
  handleAddToDiary, 
  handleAddSingleMeal 
}) => {
  if (!selectedMealPlan) return null;

  return (
    <MealPlanDetailsView 
      selectedMealPlan={selectedMealPlan}
      handleAddToDiary={handleAddToDiary}
      handleAddSingleMeal={handleAddSingleMeal}
    />
  );
};

export default MealPlanDetails;
