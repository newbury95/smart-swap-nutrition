
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { MealPlan, Food } from '@/components/food/types';

interface MealPlanDetailsViewProps {
  selectedMealPlan: MealPlan | null;
  handleAddToDiary: () => void;
  handleAddSingleMeal: (meal: Food, mealType: string) => void;
}

const MealPlanDetailsView: React.FC<MealPlanDetailsViewProps> = ({ 
  selectedMealPlan, 
  handleAddToDiary, 
  handleAddSingleMeal 
}) => {
  if (!selectedMealPlan) return null;

  const renderMealPlanItem = (item: Food, index: number, mealType: string) => (
    <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <div className="text-xs text-gray-500 flex gap-2">
          <span>{item.calories} kcal</span>
          <span>{item.protein}g protein</span>
          <span>{item.carbs}g carbs</span>
          <span>{item.fat}g fat</span>
        </div>
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 p-0" 
        onClick={() => handleAddSingleMeal(item, mealType)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <>
      <SheetHeader className="mb-4">
        <SheetTitle>{selectedMealPlan.name}</SheetTitle>
        <SheetDescription>{selectedMealPlan.description}</SheetDescription>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedMealPlan.dietaryRestrictions.map(restriction => (
            <span key={restriction} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {restriction}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-700">{selectedMealPlan.calories}</div>
            <div className="text-xs text-blue-600">calories</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-700">{selectedMealPlan.protein}g</div>
            <div className="text-xs text-green-600">protein</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="font-medium text-yellow-700">{selectedMealPlan.carbs}g</div>
            <div className="text-xs text-yellow-600">carbs</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <div className="font-medium text-red-700">{selectedMealPlan.fat}g</div>
            <div className="text-xs text-red-600">fat</div>
          </div>
        </div>
      </SheetHeader>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          3-Day Meal Plan
        </h3>
        
        <Tabs defaultValue="day1">
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="day1" className="flex-1">Day 1</TabsTrigger>
            <TabsTrigger value="day2" className="flex-1">Day 2</TabsTrigger>
            <TabsTrigger value="day3" className="flex-1">Day 3</TabsTrigger>
          </TabsList>
          
          {selectedMealPlan.days.map((day, index) => (
            <TabsContent key={index} value={`day${day.day}`} className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Breakfast</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {day.breakfast.map((item, i) => renderMealPlanItem(item, i, "breakfast"))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Lunch</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {day.lunch.map((item, i) => renderMealPlanItem(item, i, "lunch"))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Dinner</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {day.dinner.map((item, i) => renderMealPlanItem(item, i, "dinner"))}
                </div>
              </div>
              
              {day.snacks.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Snacks</h4>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {day.snacks.map((item, i) => renderMealPlanItem(item, i, "snack"))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="mt-6">
        <Button onClick={handleAddToDiary} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add to My Food Diary
        </Button>
      </div>
    </>
  );
};

export default MealPlanDetailsView;
