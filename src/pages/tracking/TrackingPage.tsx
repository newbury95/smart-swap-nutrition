
import { memo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useExerciseTracking } from "@/hooks/useExerciseTracking";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import { NutritionSettingsForm } from "@/components/tracking/settings";
import ExerciseDialog from "@/components/tracking/ExerciseDialog";
import DashboardContent from "@/components/tracking/DashboardContent";
import { Dumbbell, Calculator } from "lucide-react";
import { useMealManagement } from "@/hooks/useMealManagement";
import { PageLoading } from "@/components/PageLoading";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const TrackingPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { addHealthMetric, isPremium } = useSupabase();
  const [today] = useState(new Date());
  const [showCalorieDialog, setShowCalorieDialog] = useState(false);

  const {
    loading: settingsLoading,
    settings,
    calculations,
    updateSetting,
    updateCustomMacroRatio,
  } = useUserNutrition();

  const { 
    exercises, 
    caloriesBurned,
    showExerciseDialog,
    setShowExerciseDialog,
    handleAddExercise,
    loading: exercisesLoading
  } = useExerciseTracking({ 
    isPremium, 
    addHealthMetric 
  });

  // Get actual consumption data from meals
  const { getAllMealsNutrients, isLoading: mealsLoading } = useMealManagement(today);
  
  // Check if any data is still loading
  const isLoading = settingsLoading || exercisesLoading || mealsLoading;

  const handleAddExerciseWithFeedback = async (exerciseData: any) => {
    try {
      await handleAddExercise(exerciseData);
      toast({
        title: "Exercise Added",
        description: "Your exercise has been logged successfully",
      });
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add exercise. Please try again.",
      });
    }
  };
  
  const handleAcceptRecommended = () => {
    if (!calculations?.calorieTarget) return;
    
    toast({
      title: "Recommended Calories Applied",
      description: `Your daily target is now ${calculations.calorieTarget} calories`,
    });
    setShowCalorieDialog(false);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  // Get latest nutrition data
  const todayNutrients = getAllMealsNutrients();
  
  // Create current consumption with real data
  const currentConsumption = {
    calories: todayNutrients.calories || 0,
    macros: {
      protein: todayNutrients.protein || 0,
      carbs: todayNutrients.carbs || 0,
      fats: todayNutrients.fat || 0
    }
  };
  
  // Calculate remaining calories
  const calorieTarget = calculations?.calorieTarget || 2000;
  const remainingCalories = calorieTarget - currentConsumption.calories;

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackingHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Dialog open={showCalorieDialog} onOpenChange={setShowCalorieDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate Targets
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogTitle>Recommended Calorie Target</DialogTitle>
                    <DialogDescription>
                      Based on your metrics, we recommend the following daily calorie intake:
                    </DialogDescription>
                    
                    <div className="my-6">
                      <div className="bg-purple-50 p-6 rounded-lg text-center">
                        <h3 className="text-lg text-purple-800 font-medium mb-2">Recommended Daily Calories</h3>
                        <p className="text-3xl font-bold text-purple-900">{calorieTarget} kcal</p>
                        <p className="text-sm text-purple-700 mt-2">Based on your BMR, activity level, and goals</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-blue-50 p-3 rounded-md text-center">
                          <p className="text-sm text-blue-800 font-medium">BMR</p>
                          <p className="text-lg font-semibold text-blue-900">{calculations?.bmr || 0} kcal</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md text-center">
                          <p className="text-sm text-green-800 font-medium">TDEE</p>
                          <p className="text-lg font-semibold text-green-900">{calculations?.tdee || 0} kcal</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-md text-center">
                          <p className="text-sm text-orange-800 font-medium">Remaining</p>
                          <p className="text-lg font-semibold text-orange-900">{remainingCalories} kcal</p>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter className="flex-col sm:flex-row sm:justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCalorieDialog(false)}
                      >
                        Adjust in Settings
                      </Button>
                      <Button 
                        onClick={handleAcceptRecommended}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Accept Recommended
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setShowExerciseDialog(true)}
                >
                  <Dumbbell className="w-4 h-4" />
                  Log Exercise
                </Button>
              </div>
            </div>

            <TabsContent value="dashboard" className="space-y-8">
              <DashboardContent
                calculations={calculations}
                settings={settings}
                currentConsumption={currentConsumption}
                exercises={exercises}
                caloriesBurned={caloriesBurned}
                isPremium={isPremium}
                onUpdateSetting={updateSetting}
                onUpdateCustomMacroRatio={updateCustomMacroRatio}
              />
            </TabsContent>
            
            <TabsContent value="settings">
              <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md">Error loading settings form</div>}>
                <NutritionSettingsForm 
                  settings={settings}
                  isPremium={isPremium}
                  onUpdateSetting={updateSetting}
                  onUpdateCustomMacroRatio={updateCustomMacroRatio}
                />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ExerciseDialog 
        open={showExerciseDialog}
        onOpenChange={setShowExerciseDialog}
        onSave={handleAddExerciseWithFeedback}
        isPremium={isPremium}
      />
    </div>
  );
};

export default memo(TrackingPage);
