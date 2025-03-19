
import { memo, useState, useEffect } from "react";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import { PageLoading } from "@/components/PageLoading";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import NutritionSummaryCards from "@/components/tracking/dashboard/NutritionSummaryCards";
import MacroProgressDisplay from "@/components/tracking/dashboard/MacroProgressDisplay";
import WeightMetricsDisplay from "@/components/tracking/dashboard/WeightMetricsDisplay";
import GoalSelectionDialog from "@/components/tracking/GoalSelectionDialog";
import MeasurementsDialog from "@/components/tracking/MeasurementsDialog";
import { Gender } from "@/utils/nutritionCalculations";

const TrackingPage = () => {
  const { toast } = useToast();
  const [today] = useState(new Date());
  const { isPremium, addHealthMetric } = useSupabase();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showMeasurementsDialog, setShowMeasurementsDialog] = useState(false);
  const [weightHistory, setWeightHistory] = useState<{date: string, weight: number}[]>([]);
  const [isWeightHistoryLoading, setIsWeightHistoryLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    loading: settingsLoading,
    settings,
    calculations,
    updateSetting,
  } = useUserNutrition();

  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        setIsWeightHistoryLoading(true);
        const { data: weightData, error } = await supabase
          .from('health_metrics')
          .select('value, recorded_at')
          .eq('metric_type', 'weight')
          .order('recorded_at', { ascending: false })
          .limit(30);
        
        if (error) throw error;
        
        const history = weightData?.map(record => ({
          date: format(new Date(record.recorded_at), 'yyyy-MM-dd'),
          weight: Number(record.value)
        })) || [];
        
        setWeightHistory(history);
        console.log("Weight history loaded:", history);
      } catch (error) {
        console.error("Error fetching weight history:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load weight history",
        });
      } finally {
        setIsWeightHistoryLoading(false);
      }
    };
    
    if (!settingsLoading) {
      fetchWeightHistory();
    }
  }, [settingsLoading, toast]);

  const handleUpdateCalories = async (calories: number) => {
    try {
      await updateSetting('calorieTarget', calories);
      
      toast({
        title: "Calorie Goal Updated",
        description: `Your daily target is now ${calories} calories`,
      });
      
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

  const handleMeasurementsSubmit = async (weight: number, height: number, age: number, gender: Gender) => {
    setIsSubmitting(true);
    try {
      // Update all settings
      await updateSetting('weight', weight);
      await updateSetting('height', height);
      await updateSetting('age', age);
      await updateSetting('gender', gender);
      
      // Save metrics to history
      try {
        // Save weight metric
        await addHealthMetric({
          metric_type: 'weight',
          value: weight.toString(),
          source: 'manual-tracking'
        });
        
        // Save height metric
        await addHealthMetric({
          metric_type: 'height',
          value: height.toString(),
          source: 'manual-tracking'
        });
        
        // Save age metric
        await addHealthMetric({
          metric_type: 'age',
          value: age.toString(),
          source: 'manual-tracking'
        });
        
        // Save gender metric
        await addHealthMetric({
          metric_type: 'gender',
          value: gender,
          source: 'manual-tracking'
        });
        
        // Update weight history state
        setWeightHistory(prev => [{
          date: format(new Date(), 'yyyy-MM-dd'),
          weight
        }, ...prev]);
        
        toast({
          title: "Measurements Updated",
          description: "Your measurements have been updated successfully.",
        });
        
        // Close dialog after successful submission
        setShowMeasurementsDialog(false);
      } catch (error) {
        console.error("Error saving health metrics:", error);
        toast({
          variant: "destructive",
          title: "Partial Update",
          description: "Your settings were updated but we couldn't save the measurements history.",
        });
      }
    } catch (error) {
      console.error("Error updating measurements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update measurements. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetGoal = async (goal: 'weight_loss' | 'maintenance' | 'mass_building') => {
    try {
      await updateSetting('fitnessGoal', goal);
      setShowGoalDialog(false);
      
      toast({
        title: "Goal Updated",
        description: `Your fitness goal has been set to ${goal.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update goal. Please try again.",
      });
    }
  };

  if (settingsLoading) {
    return <PageLoading />;
  }

  // Use memoized values to prevent unnecessary recalculations
  const bmr = calculations?.bmr || 0;
  const calorieTarget = calculations?.calorieTarget || 2000;
  const { protein: proteinTarget, carbs: carbsTarget, fats: fatsTarget } = calculations?.macros || { protein: 0, carbs: 0, fats: 0 };
  
  // Sample mock data for display - in a real app, this would come from actual tracking
  const consumedCalories = 1200;
  const consumedProtein = 60;
  const consumedCarbs = 120;
  const consumedFats = 45;
  
  const remainingCalories = calorieTarget - consumedCalories;
  const caloriePercentage = Math.min(Math.round((consumedCalories / calorieTarget) * 100), 100);
  const proteinPercentage = Math.min(Math.round((consumedProtein / proteinTarget) * 100), 100);
  const carbsPercentage = Math.min(Math.round((consumedCarbs / carbsTarget) * 100), 100);
  const fatsPercentage = Math.min(Math.round((consumedFats / fatsTarget) * 100), 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackingHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Tracking</h1>
          
          <NutritionSummaryCards 
            bmr={bmr}
            calorieTarget={calorieTarget}
            consumedCalories={consumedCalories}
            remainingCalories={remainingCalories}
            caloriePercentage={caloriePercentage}
            fitnessGoal={settings.fitnessGoal}
            onChangeGoalClick={() => setShowGoalDialog(true)}
          />
          
          <MacroProgressDisplay 
            consumedProtein={consumedProtein}
            proteinTarget={proteinTarget}
            proteinPercentage={proteinPercentage}
            consumedCarbs={consumedCarbs}
            carbsTarget={carbsTarget}
            carbsPercentage={carbsPercentage}
            consumedFats={consumedFats}
            fatsTarget={fatsTarget}
            fatsPercentage={fatsPercentage}
          />
          
          <WeightMetricsDisplay 
            weight={settings.weight}
            height={settings.height}
            weightHistory={weightHistory}
            isWeightHistoryLoading={isWeightHistoryLoading}
            onUpdateClick={() => setShowMeasurementsDialog(true)}
          />
          
          {/* Goal Selection Dialog */}
          <GoalSelectionDialog 
            open={showGoalDialog} 
            onOpenChange={setShowGoalDialog} 
            onSelectGoal={handleSetGoal} 
          />
          
          {/* Measurements Dialog */}
          <MeasurementsDialog
            open={showMeasurementsDialog}
            onOpenChange={setShowMeasurementsDialog}
            initialWeight={settings.weight}
            initialHeight={settings.height}
            initialAge={settings.age}
            initialGender={settings.gender}
            onSubmit={handleMeasurementsSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </div>
  );
};

export default memo(TrackingPage);
