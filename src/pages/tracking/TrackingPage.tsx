
import { memo } from "react";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useSupabase } from "@/hooks/useSupabase";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import { PageLoading } from "@/components/PageLoading";
import NutritionSummaryCards from "@/components/tracking/dashboard/NutritionSummaryCards";
import MacroProgressDisplay from "@/components/tracking/dashboard/MacroProgressDisplay";
import WeightMetricsDisplay from "@/components/tracking/dashboard/WeightMetricsDisplay";
import WeightProgressChart from "@/components/tracking/WeightProgressChart";
import GoalSelectionDialog from "@/components/tracking/GoalSelectionDialog";
import MeasurementsDialog from "@/components/tracking/MeasurementsDialog";
import { useGoalManager } from "@/components/tracking/goals/useGoalManager";
import { useMeasurementManager } from "@/components/tracking/measurements/useMeasurementManager";
import { useNutritionData } from "@/components/tracking/nutrition/useNutritionData";
import { useWeightData } from "@/components/tracking/weight/useWeightData";
import { Gender } from "@/utils/nutritionCalculations";

const TrackingPage = () => {
  const { addHealthMetric } = useSupabase();
  const {
    loading: settingsLoading,
    settings,
    calculations,
    updateSetting,
  } = useUserNutrition();

  // Custom hooks for managing different parts of the page
  const consumedNutrition = useNutritionData();
  const { weightHistory, isWeightHistoryLoading, addWeightRecord } = useWeightData();
  
  // Goal manager hook
  const { showGoalDialog, setShowGoalDialog, handleSetGoal } = useGoalManager(
    async (goal) => await updateSetting('fitnessGoal', goal)
  );
  
  // Measurements manager hook
  const { 
    showMeasurementsDialog, 
    setShowMeasurementsDialog, 
    handleMeasurementsSubmit,
    isSubmitting 
  } = useMeasurementManager(
    settings.weight,
    settings.height,
    settings.age,
    settings.gender,
    async (weight, height, age, gender) => {
      await updateSetting('weight', weight);
      await updateSetting('height', height);
      await updateSetting('age', age);
      await updateSetting('gender', gender);
      addWeightRecord(weight);
    },
    addHealthMetric
  );

  if (settingsLoading) {
    return <PageLoading />;
  }

  const bmr = calculations?.bmr || 0;
  const calorieTarget = calculations?.calorieTarget || 2000;
  const { protein: proteinTarget, carbs: carbsTarget, fats: fatsTarget } = calculations?.macros || { protein: 0, carbs: 0, fats: 0 };
  
  const consumedCalories = consumedNutrition.calories;
  const consumedProtein = consumedNutrition.protein;
  const consumedCarbs = consumedNutrition.carbs;
  const consumedFats = consumedNutrition.fats;
  
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
          
          <WeightProgressChart 
            weightHistory={weightHistory}
            isLoading={isWeightHistoryLoading}
          />
          
          <WeightMetricsDisplay 
            weight={settings.weight}
            height={settings.height}
            weightHistory={weightHistory}
            isWeightHistoryLoading={isWeightHistoryLoading}
            onUpdateClick={() => setShowMeasurementsDialog(true)}
          />
          
          <GoalSelectionDialog 
            open={showGoalDialog} 
            onOpenChange={setShowGoalDialog} 
            onSelectGoal={handleSetGoal} 
          />
          
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
