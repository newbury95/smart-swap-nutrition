
import React, { useEffect, useState } from 'react';
import { Footprints, Droplets, Flame } from "lucide-react";
import { useHealthIntegration } from '@/hooks/useHealthIntegration';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailySummaryProps {
  dailyTotals: NutritionSummary;
}

export const DailySummary = ({ dailyTotals }: DailySummaryProps) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const { toast } = useToast();
  const { 
    healthData, 
    connectedProvider, 
    syncHealthData,
    isLoading: healthLoading 
  } = useHealthIntegration();

  const handleWaterChange = (amount: number) => {
    const newAmount = Math.max(0, waterIntake + amount);
    setWaterIntake(newAmount);
    
    // Update localStorage
    localStorage.setItem('waterIntake', newAmount.toString());
    
    if (amount > 0) {
      toast({
        title: "Water intake updated",
        description: `Added ${amount}ml of water`,
      });
    }
  };
  
  const handleSyncHealth = async () => {
    try {
      if (connectedProvider) {
        await syncHealthData();
        toast({
          title: "Health data synced",
          description: "Latest health data has been updated"
        });
      } else {
        toast({
          title: "No health app connected",
          description: "Connect to a health app in the tracking page",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing health data:", error);
      toast({
        title: "Sync failed",
        description: "Failed to sync health data",
        variant: "destructive"
      });
    }
  };

  // Load water intake from localStorage on component mount
  useEffect(() => {
    const storedWaterIntake = localStorage.getItem('waterIntake');
    if (storedWaterIntake) {
      setWaterIntake(parseInt(storedWaterIntake));
    }
  }, []);

  // Get calories burned from localStorage or health integration
  useEffect(() => {
    if (healthData?.caloriesBurned) {
      setCaloriesBurned(healthData.caloriesBurned);
    } else {
      const storedCaloriesBurned = localStorage.getItem('caloriesBurned');
      if (storedCaloriesBurned) {
        setCaloriesBurned(parseInt(storedCaloriesBurned));
      }
    }
  }, [healthData]);

  // Calculate net calories (intake - burned)
  const netCalories = dailyTotals.calories - caloriesBurned;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Daily Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Calories</span>
          <div className="flex flex-col items-end">
            <span className="font-medium">{dailyTotals.calories} kcal</span>
            {caloriesBurned > 0 && (
              <>
                <span className="text-xs text-red-500">-{caloriesBurned} kcal (burned)</span>
                <span className="text-xs font-medium">= {netCalories} kcal (net)</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Protein</span>
          <span className="font-medium">{dailyTotals.protein}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Carbs</span>
          <span className="font-medium">{dailyTotals.carbs}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fat</span>
          <span className="font-medium">{dailyTotals.fat}g</span>
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Daily Steps</span>
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-green-600" />
              <span className="font-medium">{healthData?.steps || 0}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {connectedProvider ? 
                `Synced with ${connectedProvider === 'apple' ? 'Apple Health' : 'Samsung Health'}` : 
                'Connect to a health app to sync data'}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSyncHealth}
              disabled={healthLoading || !connectedProvider}
              className="h-6 text-xs"
            >
              {healthLoading ? "Syncing..." : "Sync"}
            </Button>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                Water Intake
              </span>
              <span className="font-medium">{waterIntake}ml</span>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => handleWaterChange(-100)}
                className="flex-1 px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              >
                -100ml
              </button>
              <button
                onClick={() => handleWaterChange(100)}
                className="flex-1 px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                +100ml
              </button>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => handleWaterChange(250)}
                className="flex-1 px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                +250ml
              </button>
              <button
                onClick={() => handleWaterChange(500)}
                className="flex-1 px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                Calories Burned
              </span>
              <span className="font-medium">{caloriesBurned} kcal</span>
            </div>
            <p className="text-xs text-gray-500">
              Use the Health Metrics section to log and track your activity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
