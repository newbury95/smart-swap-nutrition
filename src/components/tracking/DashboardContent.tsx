
import React, { useState, useEffect, useMemo } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import CircularGoalProgress from './CircularGoalProgress';
import NutritionDashboard from './NutritionDashboard';
import ProgressChartSection from './ProgressChartSection';
import WeeklyNutritionChart from './dashboard/WeeklyNutritionChart';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMealManagement } from '@/hooks/useMealManagement';
import { PageLoading } from '@/components/PageLoading';
import { NutritionSettings, MacroRatio } from '@/hooks/useUserNutrition';

interface DashboardContentProps {
  calculations: any;
  settings: NutritionSettings;
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
  onUpdateSetting: <K extends keyof NutritionSettings>(key: K, value: NutritionSettings[K]) => Promise<void>;
  onUpdateCustomMacroRatio: (ratio: MacroRatio) => Promise<void>;
}

const DashboardContent = ({
  calculations,
  settings,
  exercises,
  caloriesBurned,
  isPremium,
  onUpdateSetting,
  onUpdateCustomMacroRatio
}: DashboardContentProps) => {
  // Use current date for consistent meal data
  const [today] = useState(new Date());
  const { getAllMealsNutrients, isLoading } = useMealManagement(today);
  const [todayNutrients, setTodayNutrients] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  useEffect(() => {
    // Get actual consumption data when loaded
    if (!isLoading) {
      const nutrients = getAllMealsNutrients();
      setTodayNutrients(nutrients);
    }
  }, [isLoading, getAllMealsNutrients]);

  // Convert fat property to fats to match expected interface
  const actualConsumption = useMemo(() => ({
    calories: todayNutrients.calories || 0,
    macros: {
      protein: todayNutrients.protein || 0,
      carbs: todayNutrients.carbs || 0,
      fats: todayNutrients.fat || 0
    }
  }), [todayNutrients]);
  
  // Ensure we have valid calorie target with fallback
  const calculationsLoading = !calculations || 
    !calculations.calorieTarget || 
    !calculations.bmr || 
    !calculations.tdee;
  
  const validCalorieTarget = calculations?.calorieTarget && !isNaN(calculations.calorieTarget) 
    ? calculations.calorieTarget 
    : 2000;
  
  // Loading state for the entire dashboard
  const dashboardLoading = isLoading || calculationsLoading;
  
  // Debug information to help trace issues
  console.log('Dashboard content rendering:', {
    calculationsLoading,
    calculations,
    settings,
    isLoading,
    validCalorieTarget,
    actualConsumption
  });
  
  if (dashboardLoading && !calculations) {
    return <PageLoading />;
  }

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading nutrition dashboard</div>}>
      {/* Circular progress for calories */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow duration-300">
        <div className="mb-6 md:mb-0 flex flex-col items-center">
          <CircularGoalProgress 
            value={actualConsumption.calories} 
            maxValue={validCalorieTarget}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {actualConsumption.calories.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                of {validCalorieTarget.toLocaleString()} kcal
              </div>
            </div>
          </CircularGoalProgress>
        </div>
        
        <div className="flex-1 md:ml-8">
          <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Calories Remaining</span>
              <span className={`font-semibold ${(validCalorieTarget - actualConsumption.calories) < 0 ? 'text-red-500' : ''}`}>
                {(validCalorieTarget - actualConsumption.calories).toLocaleString()} kcal
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exercises</span>
              <span className="font-semibold">{exercises?.length || 0}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Calories Burned</span>
              <span className="font-semibold">{caloriesBurned || 0} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main nutrition dashboard */}
      <NutritionDashboard 
        calculations={calculations}
        settings={settings}
        isPremium={isPremium}
        currentCalories={actualConsumption.calories}
        currentMacros={actualConsumption.macros}
        onUpdateSetting={onUpdateSetting}
        onUpdateCustomMacroRatio={onUpdateCustomMacroRatio}
        isLoading={dashboardLoading}
      />

      {/* Weekly Nutrition Chart - New Component */}
      <WeeklyNutritionChart isPremium={isPremium} />

      {/* Progress chart */}
      <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading progress chart</div>}>
        <ProgressChartSection 
          data={[]} // This can be updated later with real tracking data
          timeRange="weekly"
          onTimeRangeChange={() => {}}
          isPremium={isPremium}
        />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default DashboardContent;
