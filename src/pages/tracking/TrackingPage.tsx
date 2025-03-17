
import { memo, useState, useEffect } from "react";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import { HealthMetrics } from "@/components/diary/HealthMetrics";
import { useMealManagement } from "@/hooks/useMealManagement";
import { PageLoading } from "@/components/PageLoading";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Activity, 
  Weight, 
  ArrowRight 
} from "lucide-react";

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

  const handleBMISubmit = async (weight: number, height: number) => {
    try {
      await updateSetting('weight', weight);
      await updateSetting('height', height);
      
      toast({
        title: "Measurements Updated",
        description: "Your height and weight have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating measurements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update measurements. Please try again.",
      });
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Tracking</h1>
          
          {/* Current Measurements Card */}
          <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Measurements</h2>
                <button 
                  onClick={() => document.getElementById('measurements-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Update <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <Weight className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Current Weight</p>
                    <p className="text-2xl font-bold text-blue-800">{settings.weight} kg</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="p-3 bg-purple-100 rounded-full mr-4">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600">Current Height</p>
                    <p className="text-2xl font-bold text-purple-800">{settings.height} cm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* BMR and Calorie Goals Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading health metrics</div>}>
              <HealthMetrics
                bmr={calculations?.bmr || 1800}
                currentCalories={calorieTarget}
                isPremium={isPremium}
                onUpdateCalories={handleUpdateCalories}
              />
            </ErrorBoundary>
          </div>

          {/* Daily Summary Card */}
          <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Nutrition Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="text-sm font-medium text-indigo-700 mb-1">Daily Target</h3>
                  <p className="text-2xl font-bold text-indigo-900">{calorieTarget.toLocaleString()} kcal</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-700 mb-1">Consumed Today</h3>
                  <p className="text-2xl font-bold text-green-900">{(todayNutrients.calories || 0).toLocaleString()} kcal</p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-700 mb-1">Remaining</h3>
                  <p className={`text-2xl font-bold ${remainingCalories < 0 ? 'text-red-600' : 'text-amber-900'}`}>
                    {remainingCalories.toLocaleString()} kcal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Measurements Form */}
          <Card id="measurements-form" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Update Your Measurements</h2>
              <p className="text-gray-600 mb-6">Enter your current weight and height to keep your BMR calculation accurate.</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const weightInput = (document.getElementById('weight-input') as HTMLInputElement)?.value;
                const heightInput = (document.getElementById('height-input') as HTMLInputElement)?.value;
                
                if (weightInput && heightInput) {
                  handleBMISubmit(
                    parseFloat(weightInput),
                    parseFloat(heightInput)
                  );
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      id="weight-input"
                      type="number"
                      defaultValue={settings.weight}
                      step="0.1"
                      min="30"
                      max="250"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="height-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      id="height-input"
                      type="number"
                      defaultValue={settings.height}
                      step="0.1"
                      min="100"
                      max="250"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Measurements
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default memo(TrackingPage);
