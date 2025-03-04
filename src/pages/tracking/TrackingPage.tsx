
import { memo, useCallback, useState } from "react";
import { useTrackingData } from "@/hooks/useTrackingData";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import MetricsSection from "@/components/tracking/MetricsSection";
import RecentExercises from "@/components/tracking/RecentExercises";
import BMIFormSection from "@/components/tracking/BMIFormSection";
import ProgressChartSection from "@/components/tracking/ProgressChartSection";
import ExerciseDialog from "@/components/tracking/ExerciseDialog";
import HealthAppConnector from "@/components/tracking/HealthAppConnector";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const TrackingPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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
    
  const handleAddExerciseWithErrorHandling = useCallback(async (exerciseData: any) => {
    setIsLoading(true);
    try {
      await handleAddExercise(exerciseData);
      toast({
        title: "Success",
        description: "Exercise added successfully"
      });
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add exercise. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }, [handleAddExercise, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackingHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 mb-4">There was an error loading the metrics section.</div>}>
            <MetricsSection 
              latestBMI={latestBMI}
              exercises={exercises}
              caloriesBurned={caloriesBurned}
              steps={steps}
              isPremium={isPremium}
              onShowExerciseDialog={() => setShowExerciseDialog(true)}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 mb-4">There was an error loading recent exercises.</div>}>
            {exercises.length > 0 && (
              <RecentExercises exercises={exercises} />
            )}
          </ErrorBoundary>

          <div className="mb-8">
            <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 mb-4">There was an error loading health app connection features.</div>}>
              <HealthAppConnector />
            </ErrorBoundary>
          </div>

          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 mb-4">There was an error loading the BMI form.</div>}>
            <BMIFormSection onSubmit={handleBMISubmit} />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-red-100 rounded-md text-red-700 mb-4">There was an error loading the progress chart.</div>}>
            <ProgressChartSection 
              data={trackingData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              isPremium={isPremium}
            />
          </ErrorBoundary>
        </div>
      </main>

      <ExerciseDialog 
        open={showExerciseDialog}
        onOpenChange={setShowExerciseDialog}
        onSave={handleAddExerciseWithErrorHandling}
        isPremium={isPremium}
      />
    </div>
  );
};

export default memo(TrackingPage);
