
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import CircularGoalProgress from './CircularGoalProgress';
import NutritionDashboard from './NutritionDashboard';
import ProgressChartSection from './ProgressChartSection';
import { Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading nutrition dashboard</div>}>
      {/* Circular progress for calories */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 flex flex-col items-center">
          <CircularGoalProgress 
            value={currentConsumption.calories} 
            maxValue={calculations.calorieTarget}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {currentConsumption.calories}
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
                {calculations.calorieTarget - currentConsumption.calories} kcal
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
        currentCalories={currentConsumption.calories}
        currentMacros={currentConsumption.macros}
      />

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
