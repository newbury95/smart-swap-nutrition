
import { memo } from "react";
import { useTrackingData } from "@/hooks/useTrackingData";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import MetricsSection from "@/components/tracking/MetricsSection";
import RecentExercises from "@/components/tracking/RecentExercises";
import BMIFormSection from "@/components/tracking/BMIFormSection";
import ProgressChartSection from "@/components/tracking/ProgressChartSection";
import ExerciseDialog from "@/components/tracking/ExerciseDialog";

const TrackingPage = () => {
  const {
    timeRange,
    setTimeRange,
    steps,
    trackingData,
    isPremium,
    exercises,
    caloriesBurned,
    showExerciseDialog,
    setShowExerciseDialog,
    handleAddExercise,
    handleBMISubmit
  } = useTrackingData();

  const latestBMI = trackingData.length > 0 ? 
    trackingData[trackingData.length - 1]?.bmi || 0 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackingHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <MetricsSection 
            latestBMI={latestBMI}
            exercises={exercises}
            caloriesBurned={caloriesBurned}
            steps={steps}
            isPremium={isPremium}
            onShowExerciseDialog={() => setShowExerciseDialog(true)}
          />

          {exercises.length > 0 && (
            <RecentExercises exercises={exercises} />
          )}

          <BMIFormSection onSubmit={handleBMISubmit} />

          <ProgressChartSection 
            data={trackingData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isPremium={isPremium}
          />
        </div>
      </main>

      <ExerciseDialog 
        open={showExerciseDialog}
        onOpenChange={setShowExerciseDialog}
        onSave={handleAddExercise}
        isPremium={isPremium}
      />
    </div>
  );
};

export default memo(TrackingPage);
