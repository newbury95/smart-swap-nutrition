
import { memo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useExerciseTracking } from "@/hooks/useExerciseTracking";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import NutritionDashboard from "@/components/tracking/NutritionDashboard";
import NutritionSettingsForm from "@/components/tracking/NutritionSettingsForm";
import CircularGoalProgress from "@/components/tracking/CircularGoalProgress";
import ExerciseDialog from "@/components/tracking/ExerciseDialog";
import ProgressChartSection from "@/components/tracking/ProgressChartSection";
import { Dumbbell, Settings, ChevronRight } from "lucide-react";

const TrackingPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { addHealthMetric, isPremium } = useSupabase();

  // Use our new user nutrition hook
  const {
    loading,
    settings,
    calculations,
    updateSetting,
    updateCustomMacroRatio,
  } = useUserNutrition();

  // Use existing exercise tracking hook
  const { 
    exercises, 
    caloriesBurned,
    showExerciseDialog,
    setShowExerciseDialog,
    handleAddExercise
  } = useExerciseTracking({ 
    isPremium, 
    addHealthMetric 
  });

  // Mock current day's consumed calories and macros
  // In a real app, this would come from the food diary
  const [currentConsumption, setCurrentConsumption] = useState({
    calories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fats: 0
    }
  });

  // Simulate current day's food consumption
  // In a real app, this would be fetched from the database
  useEffect(() => {
    // Mock data - would be replaced with actual user's food diary data
    setCurrentConsumption({
      calories: 1250,
      macros: {
        protein: 75,
        carbs: 120,
        fats: 45
      }
    });
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

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

            <TabsContent value="dashboard" className="space-y-8">
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
                        onClick={() => setActiveTab("settings")}
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
