
import { memo, useState } from "react";
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
import { Dumbbell } from "lucide-react";

const TrackingPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { addHealthMetric, isPremium } = useSupabase();

  const {
    loading,
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
    handleAddExercise
  } = useExerciseTracking({ 
    isPremium, 
    addHealthMetric 
  });

  // Initialize current consumption state with zeros
  const [currentConsumption] = useState({
    calories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fats: 0
    }
  });

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
              <DashboardContent
                calculations={calculations}
                currentConsumption={currentConsumption}
                exercises={exercises}
                caloriesBurned={caloriesBurned}
                isPremium={isPremium}
                onSettingsClick={() => setActiveTab("settings")}
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
