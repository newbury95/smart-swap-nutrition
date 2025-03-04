
import { useState, useEffect, useMemo, useCallback } from "react";
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
  
  // Use the exercise tracking hook with memoized callback
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
      if (!isPremium) return; // Skip fetch if not premium
      
      try {
        // Fetch step data
        const stepMetrics = await getHealthMetrics('steps');
        if (stepMetrics.length > 0) {
          setSteps(stepMetrics[0].value);
        }
        
        // Update the tracking data only if we have new data
        setTrackingData(prevData => {
          if (prevData.length === 0) return prevData;
          
          const latestData = [...prevData];
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
            return latestData;
          }
          
          return prevData;
        });
      } catch (error) {
        console.error('Error fetching health metrics:', error);
      }
    };
    
    fetchHealthData();
  }, [isPremium, getHealthMetrics, exercises.length, caloriesBurned]);

  const handleBMISubmit = useCallback((weight: number, height: number) => {
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
    setTrackingData(prevData => {
      const existingEntryIndex = prevData.findIndex(
        (item) => item.date === format(new Date(), "yyyy-MM-dd")
      );
      
      if (existingEntryIndex >= 0) {
        const updatedData = [...prevData];
        updatedData[existingEntryIndex] = newEntry;
        return updatedData;
      } else {
        return [...prevData, newEntry];
      }
    });

    toast({
      title: "Measurements updated",
      description: `Your BMI is ${bmi}`,
    });
  }, [exercises, steps, caloriesBurned, toast]);

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
