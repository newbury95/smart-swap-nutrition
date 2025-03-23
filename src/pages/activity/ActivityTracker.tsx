
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

// Import new component files
import ActivityMetricsCards from "./components/ActivityMetricsCards";
import DailyActivityTab from "./components/DailyActivityTab";
import BMRSettingsTab from "./components/BMRSettingsTab";
import CalorieTargetDialog from "./components/CalorieTargetDialog";
import { useActivityCalculator } from "./hooks/useActivityCalculator";

const ActivityTracker = () => {
  const { toast } = useToast();
  const [steps, setSteps] = useState(0);
  const [exercise, setExercise] = useState(0);
  
  // Use the activity calculator hook
  const {
    weight,
    setWeight,
    height,
    setHeight,
    age,
    setAge,
    gender,
    setGender,
    activityLevel,
    setActivityLevel,
    weightGoal,
    setWeightGoal,
    bmr,
    tdee,
    calorieTarget,
  } = useActivityCalculator();
  
  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  
  const handleUpdateSteps = () => {
    setSteps(prev => prev + 1000);
    toast({
      title: "Activity Logged",
      description: "Your steps have been recorded for the day",
    });
  };

  const handleUpdateExercise = () => {
    setExercise(prev => prev + 30);
    toast({
      title: "Exercise Logged",
      description: "Your exercise minutes have been recorded for the day",
    });
  };
  
  const handleAcceptRecommended = () => {
    toast({
      title: "Recommended Calorie Target Applied",
      description: `Your daily target has been set to ${calorieTarget} calories`,
    });
    setShowDialog(false);
  };
  
  const handleSaveCustom = () => {
    toast({
      title: "Custom Settings Saved",
      description: "Your custom BMR and calorie targets have been updated",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <div className="px-0 pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">Activity Tracking</h1>
                  <p className="text-gray-500">Track your daily activities and manage your calorie targets</p>
                </div>
                
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      <span>Calculate Targets</span>
                    </Button>
                  </DialogTrigger>
                  
                  <CalorieTargetDialog
                    open={showDialog}
                    onOpenChange={setShowDialog}
                    bmr={bmr}
                    tdee={tdee}
                    calorieTarget={calorieTarget}
                    weightGoal={weightGoal}
                    onAcceptRecommended={handleAcceptRecommended}
                  />
                </Dialog>
              </div>
            </div>
            
            <div className="px-0 pb-0 mt-6">
              <ActivityMetricsCards
                bmr={bmr}
                tdee={tdee}
                calorieTarget={calorieTarget}
              />
            </div>
          </div>
          
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">Daily Activity</TabsTrigger>
              <TabsTrigger value="settings">BMR Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <DailyActivityTab
                steps={steps}
                exercise={exercise}
                onUpdateSteps={handleUpdateSteps}
                onUpdateExercise={handleUpdateExercise}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <BMRSettingsTab
                weight={weight}
                setWeight={setWeight}
                height={height}
                setHeight={setHeight}
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                activityLevel={activityLevel}
                setActivityLevel={setActivityLevel}
                weightGoal={weightGoal}
                setWeightGoal={setWeightGoal}
                onSave={handleSaveCustom}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ActivityTracker;
