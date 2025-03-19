
import { useState, useEffect, useCallback } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (!isPremium) return; // Skip fetch if not premium
      
      try {
        // Fetch step data
        const stepMetrics = await getHealthMetrics('steps');
        if (stepMetrics.length > 0) {
          setSteps(stepMetrics[0].value);
        }
        
        // Fetch heart rate data
        const heartRateMetrics = await getHealthMetrics('heart-rate');
        if (heartRateMetrics.length > 0) {
          setHeartRate(heartRateMetrics[0].value);
        }
        
        // Fetch weight and height data for initial tracking data
        const weightMetrics = await getHealthMetrics('weight');
        const heightMetrics = await getHealthMetrics('height');
        
        // Only create tracking data if we have both weight and height
        if (weightMetrics.length > 0 && heightMetrics.length > 0) {
          const weight = weightMetrics[0].value;
          const height = heightMetrics[0].value;
          const heightInMeters = height / 100;
          const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
          
          // Update tracking data with the latest metrics
          setTrackingData(prevData => {
            // Check if we already have an entry for today
            const todayStr = format(new Date(), "yyyy-MM-dd");
            const existingEntryIndex = prevData.findIndex(item => item.date === todayStr);
            
            const newEntry: TrackingData = {
              date: todayStr,
              weight,
              height,
              bmi,
              steps: stepMetrics.length > 0 ? stepMetrics[0].value : 0,
              exerciseMinutes: exercises.reduce((total, ex) => total + ex.duration, 0),
              caloriesBurned,
            };
            
            if (existingEntryIndex >= 0) {
              const updatedData = [...prevData];
              updatedData[existingEntryIndex] = newEntry;
              return updatedData;
            } else {
              return [...prevData, newEntry];
            }
          });
        }
      } catch (error) {
        console.error('Error fetching health metrics:', error);
      }
    };
    
    fetchHealthData();
  }, [isPremium, getHealthMetrics, exercises.length, caloriesBurned]);

  const handleBMISubmit = useCallback(async (weight: number, height: number) => {
    // Calculate BMI using the standard formula: weight(kg) / (height(m) * height(m))
    const heightInMeters = height / 100;
    const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    
    setIsSubmitting(true);
    
    try {
      // Save weight metric
      await addHealthMetric({
        metric_type: 'weight',
        value: weight,
        source: 'user-input'
      });
      
      // Save height metric
      await addHealthMetric({
        metric_type: 'height',
        value: height,
        source: 'user-input'
      });
      
      const exerciseMinutes = exercises.reduce((total, ex) => total + ex.duration, 0);
      
      // Update tracking data with new measurements
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
    } catch (error) {
      console.error('Error saving health metrics:', error);
      toast({
        variant: "destructive",
        title: "Failed to save measurements",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [exercises, steps, caloriesBurned, toast, addHealthMetric]);

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
    handleBMISubmit,
    isSubmitting
  };
};
