
import { memo, useState, useEffect } from "react";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import { HealthMetrics } from "@/components/diary/HealthMetrics";
import { useMealManagement } from "@/hooks/useMealManagement";
import { PageLoading } from "@/components/PageLoading";

const TrackingPage = () => {
  const { toast } = useToast();
  const [today] = useState(new Date());
  const { isPremium } = useSupabase();

  const {
    loading: settingsLoading,
    settings,
    calculations,
    updateSetting,
  } = useUserNutrition();

  // Get actual consumption data from meals
  const { getAllMealsNutrients, isLoading: mealsLoading } = useMealManagement(today);
  
  // Check if any data is still loading
  const isLoading = settingsLoading || mealsLoading;

  const handleUpdateCalories = async (calories: number) => {
    try {
      // Update the calorie target - this effectively updates the fitnessGoal behind the scenes
      await updateSetting('calorieTarget', calories);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating calorie goal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update calorie goal. Please try again.",
      });
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  // Get latest nutrition data
  const todayNutrients = getAllMealsNutrients();
  
  // Calculate remaining calories
  const calorieTarget = calculations?.calorieTarget || 2000;
  const remainingCalories = calorieTarget - (todayNutrients.calories || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackingHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calorie Tracking</h1>
                <p className="text-gray-600">Simplify your nutrition with easy calorie goals</p>
              </div>
            </div>
            
            <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading health metrics</div>}>
              <HealthMetrics
                bmr={calculations?.bmr || 1800}
                currentCalories={calorieTarget}
                isPremium={isPremium}
                onUpdateCalories={handleUpdateCalories}
              />
            </ErrorBoundary>

            {/* Daily Summary Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-700 mb-1">Daily Target</h3>
                  <p className="text-2xl font-bold text-purple-900">{calorieTarget.toLocaleString()} kcal</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-700 mb-1">Consumed Today</h3>
                  <p className="text-2xl font-bold text-blue-900">{(todayNutrients.calories || 0).toLocaleString()} kcal</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-700 mb-1">Remaining</h3>
                  <p className={`text-2xl font-bold ${remainingCalories < 0 ? 'text-red-600' : 'text-green-900'}`}>
                    {remainingCalories.toLocaleString()} kcal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(TrackingPage);
