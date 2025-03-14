
import { useState, useEffect } from "react";
import { ExerciseType } from "@/utils/healthCalculations";
import { useToast } from "@/hooks/use-toast";

export interface Exercise {
  id: string;
  type: ExerciseType;
  description: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: string;
}

export type NewExercise = Omit<Exercise, "id" | "date">;

interface UseExerciseTrackingProps {
  isPremium: boolean;
  addHealthMetric?: (metric: any) => Promise<void>;
}

export const useExerciseTracking = ({ isPremium, addHealthMetric }: UseExerciseTrackingProps) => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Persist calories to localStorage for sharing with other components
  useEffect(() => {
    localStorage.setItem('caloriesBurned', caloriesBurned.toString());
  }, [caloriesBurned]);

  const handleAddExercise = async (newExercise: NewExercise) => {
    // Bypass premium check for testing
    // if (!isPremium) {
    //   toast({
    //     title: "Premium Feature",
    //     description: "Upgrade to Premium to log exercises",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (!newExercise.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a description for your exercise",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create the exercise object
      const exercise: Exercise = {
        id: Date.now().toString(),
        ...newExercise,
        date: new Date().toISOString()
      };
      
      setExercises(prev => [...prev, exercise]);
      setCaloriesBurned(prev => prev + newExercise.caloriesBurned);

      // Log the exercise activity if possible
      if (addHealthMetric) {
        await addHealthMetric({
          metric_type: 'activity',
          value: newExercise.caloriesBurned,
          source: 'exercise'
        });
      }
      
      toast({
        title: "Exercise Logged",
        description: `Added ${newExercise.description} (${newExercise.caloriesBurned} calories)`,
      });
      
      // Close dialog
      setShowExerciseDialog(false);
    } catch (error) {
      console.error('Error logging exercise:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log exercise",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    exercises,
    caloriesBurned,
    showExerciseDialog,
    setShowExerciseDialog,
    handleAddExercise,
    loading,
  };
};
