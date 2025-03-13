
import React, { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import CircularGoalProgress from './CircularGoalProgress';
import NutritionDashboard from './NutritionDashboard';
import ProgressChartSection from './ProgressChartSection';
import WeeklyNutritionChart from './dashboard/WeeklyNutritionChart';
import { Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMealManagement } from '@/hooks/useMealManagement';

interface DashboardContentProps {
  calculations: any;
  currentConsumption: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    }
  };
  exercises: any[];
  caloriesBurned: number;
  isPremium: boolean;
  onSettingsClick: () => void;
}

const DashboardContent = ({
  calculations,
  currentConsumption,
  exercises,
  caloriesBurned,
  isPremium,
  onSettingsClick
}: DashboardContentProps) => {
  // Use useMealManagement to get real data
  const [today] = useState(new Date());
  const { getAllMealsNutrients } = useMealManagement(today);
  
  // Get actual consumption data
  const todayNutrients = getAllMealsNutrients();
  
  // Use real data from meals instead of mock data
  const actualConsumption = {
    calories: todayNutrients.calories || 0,
    macros: {
      protein: todayNutrients.protein || 0,
      carbs: todayNutrients.carbs || 0,
      fats: todayNutrients.fat || 0
    }
  };

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading nutrition dashboard</div>}>
      {/* Circular progress for calories */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 flex flex-col items-center">
          <CircularGoalProgress 
            value={actualConsumption.calories} 
            maxValue={calculations.calorieTarget}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {actualConsumption.calories}
              </div>
              <div className="text-sm text-gray-500">
                of {calculations.calorieTarget} kcal
              </div>
            </div>
          </CircularGoalProgress>
        </div>
        
        <div className="flex-1 md:ml-8">
          <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Calories Remaining</span>
              <span className="font-semibold">
                {calculations.calorieTarget - actualConsumption.calories} kcal
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exercises</span>
              <span className="font-semibold">{exercises.length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Calories Burned</span>
              <span className="font-semibold">{caloriesBurned} kcal</span>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-2 flex items-center justify-between"
              onClick={onSettingsClick}
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Update Your Settings
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main nutrition dashboard */}
      <NutritionDashboard 
        calculations={calculations}
        currentCalories={actualConsumption.calories}
        currentMacros={actualConsumption.macros}
      />

      {/* Weekly Nutrition Chart - New Component */}
      <WeeklyNutritionChart isPremium={isPremium} />

      {/* Progress chart */}
      <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading progress chart</div>}>
        <ProgressChartSection 
          data={[]} // This would be actual tracking data
          timeRange="weekly"
          onTimeRangeChange={() => {}}
          isPremium={isPremium}
        />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default DashboardContent;
