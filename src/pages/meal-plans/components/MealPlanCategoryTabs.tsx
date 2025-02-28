
import React from 'react';
import { Utensils } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealPlan, MealPlanType } from '@/components/food/types';
import MealPlanCard from './MealPlanCard';
import DietaryRestrictionCard from './DietaryRestrictionCard';

interface MealPlanCategoryTabsProps {
  shuffledMeals: MealPlan[];
  handleOpenMealPlan: (mealPlan: MealPlan) => void;
}

const MealPlanCategoryTabs: React.FC<MealPlanCategoryTabsProps> = ({ 
  shuffledMeals, 
  handleOpenMealPlan 
}) => {
  const mealPlanTypes: { type: MealPlanType; icon: React.ReactNode; color: string }[] = [
    { type: "Low Calorie", icon: <Utensils className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
    { type: "High Protein", icon: <Utensils className="h-5 w-5" />, color: "bg-green-100 text-green-700" },
    { type: "High Carb", icon: <Utensils className="h-5 w-5" />, color: "bg-yellow-100 text-yellow-700" },
    { type: "Balanced", icon: <Utensils className="h-5 w-5" />, color: "bg-purple-100 text-purple-700" },
    { type: "Weight Loss", icon: <Utensils className="h-5 w-5" />, color: "bg-pink-100 text-pink-700" },
    { type: "Diabetic Friendly", icon: <Utensils className="h-5 w-5" />, color: "bg-red-100 text-red-700" },
    { type: "Heart Healthy", icon: <Utensils className="h-5 w-5" />, color: "bg-orange-100 text-orange-700" },
    { type: "Coeliac Friendly", icon: <Utensils className="h-5 w-5" />, color: "bg-teal-100 text-teal-700" },
    { type: "Dairy Free", icon: <Utensils className="h-5 w-5" />, color: "bg-indigo-100 text-indigo-700" },
  ];

  const dietaryRestrictions = [
    "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Diabetic-Friendly"
  ];

  return (
    <Tabs defaultValue="category">
      <TabsList className="mb-6">
        <TabsTrigger value="category">By Category</TabsTrigger>
        <TabsTrigger value="restriction">By Dietary Restriction</TabsTrigger>
      </TabsList>
      
      <TabsContent value="category">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {mealPlanTypes.map((planType, idx) => (
            <MealPlanCard
              key={planType.type}
              planType={planType}
              index={idx}
              onOpenMealPlan={handleOpenMealPlan}
              filteredPlans={shuffledMeals.filter(p => p.type === planType.type)}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="restriction">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dietaryRestrictions.map((restriction, idx) => (
            <DietaryRestrictionCard
              key={restriction}
              restriction={restriction}
              index={idx}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MealPlanCategoryTabs;
