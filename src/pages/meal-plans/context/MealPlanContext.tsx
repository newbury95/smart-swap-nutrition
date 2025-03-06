
import React, { createContext, useContext, useState } from 'react';
import { MealPlan } from '@/components/food/types';

interface MealPlanContextType {
  selectedMealPlan: MealPlan | null;
  setSelectedMealPlan: (plan: MealPlan | null) => void;
  showMealPlanDetails: boolean;
  setShowMealPlanDetails: (show: boolean) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);

  return (
    <MealPlanContext.Provider value={{
      selectedMealPlan,
      setSelectedMealPlan,
      showMealPlanDetails,
      setShowMealPlanDetails,
    }}>
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlanContext = () => {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlanContext must be used within a MealPlanProvider');
  }
  return context;
};
