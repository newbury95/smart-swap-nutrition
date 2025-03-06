
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealPlan } from '@/components/food/types';
import CategoryTabContent from './CategoryTabContent';
import RestrictionTabContent from './RestrictionTabContent';

interface MealPlanCategoryTabsProps {
  shuffledMeals: MealPlan[];
  handleOpenMealPlan: (mealPlan: MealPlan) => void;
}

const MealPlanCategoryTabs: React.FC<MealPlanCategoryTabsProps> = ({ 
  shuffledMeals, 
  handleOpenMealPlan 
}) => {
  return (
    <Tabs defaultValue="category">
      <TabsList className="mb-6">
        <TabsTrigger value="category">By Category</TabsTrigger>
        <TabsTrigger value="restriction">By Dietary Restriction</TabsTrigger>
      </TabsList>
      
      <TabsContent value="category">
        <CategoryTabContent 
          shuffledMeals={shuffledMeals} 
          handleOpenMealPlan={handleOpenMealPlan} 
        />
      </TabsContent>
      
      <TabsContent value="restriction">
        <RestrictionTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default MealPlanCategoryTabs;
