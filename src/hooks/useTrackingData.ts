
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { TimeRange, TrackingData } from "@/types/tracking";
import { useSupabase } from "@/hooks/useSupabase";
import { useExerciseTracking } from "@/hooks/useExerciseTracking";
import { useToast } from "@/hooks/use-toast";

export const useTrackingData = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [steps, setSteps] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const { isPremium, addHealthMetric, getHealthMetrics } = useSupabase();
  
  // Use the exercise tracking hook
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

  // Load health metrics data when component mounts
  useEffect(() => {
    const fetchHealthData = async () => {
      if (isPremium) {
        try {
          // Fetch step data
          const stepMetrics = await getHealthMetrics('steps');
          if (stepMetrics.length > 0) {
            setSteps(stepMetrics[0].value);
          }
          
          // Update the tracking data with the latest metrics
          if (trackingData.length > 0) {
            const latestData = [...trackingData];
            const todayIndex = latestData.findIndex(
              (item) => item.date === format(new Date(), "yyyy-MM-dd")
            );
            
            if (todayIndex >= 0) {
              latestData[todayIndex] = {
                ...latestData[todayIndex],
                steps: stepMetrics.length > 0 ? stepMetrics[0].value : 0,
                caloriesBurned,
                exerciseMinutes: exercises.reduce((total, ex) => total + ex.duration, 0)
              };
              setTrackingData(latestData);
            }
          }
        } catch (error) {
          console.error('Error fetching health metrics:', error);
        }
      }
    };
    
    fetchHealthData();
  }, [isPremium, getHealthMetrics, exercises, caloriesBurned]);

  const handleBMISubmit = (weight: number, height: number) => {
    const bmi = calculateBMI(weight, height);
    const exerciseMinutes = exercises.reduce((total, ex) => total + ex.duration, 0);
    
    const newEntry: TrackingData = {
      date: format(new Date(), "yyyy-MM-dd"),
      weight,
      height,
      bmi,
      steps,
      exerciseMinutes,
      caloriesBurned,
    };

    // Update or add the entry for today
    const existingEntryIndex = trackingData.findIndex(
      (item) => item.date === format(new Date(), "yyyy-MM-dd")
    );
    
    if (existingEntryIndex >= 0) {
      const updatedData = [...trackingData];
      updatedData[existingEntryIndex] = newEntry;
      setTrackingData(updatedData);
    } else {
      setTrackingData([...trackingData, newEntry]);
    }

    toast({
      title: "Measurements updated",
      description: `Your BMI is ${bmi}`,
    });
  };

  return {
    timeRange,
    setTimeRange,
    steps,
    heartRate,
    trackingData,
    isPremium,
    exercises,
    caloriesBurned,
    showExerciseDialog,
    setShowExerciseDialog,
    handleAddExercise,
    handleBMISubmit
  };
};

// Helper function moved from healthCalculations.ts
const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};
