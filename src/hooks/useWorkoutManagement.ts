
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Workout } from '@/pages/premium/data/workoutData';

export const useWorkoutManagement = () => {
  const { toast } = useToast();
  const [savedWorkouts, setSavedWorkouts] = useState<string[]>([]);
  
  // Load saved workouts from localStorage on init
  useEffect(() => {
    const stored = localStorage.getItem('savedWorkouts');
    if (stored) {
      try {
        setSavedWorkouts(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading saved workouts:', error);
      }
    }
  }, []);
  
  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);
  
  const addWorkout = (workoutId: string) => {
    if (!savedWorkouts.includes(workoutId)) {
      setSavedWorkouts(prev => [...prev, workoutId]);
      toast({
        title: "Workout Saved",
        description: "This workout has been added to your saved workouts."
      });
      return true;
    } else {
      toast({
        title: "Already Saved",
        description: "This workout is already in your saved workouts."
      });
      return false;
    }
  };
  
  const removeWorkout = (workoutId: string) => {
    setSavedWorkouts(prev => prev.filter(id => id !== workoutId));
    toast({
      title: "Workout Removed",
      description: "This workout has been removed from your saved workouts."
    });
  };
  
  const isWorkoutSaved = (workoutId: string) => {
    return savedWorkouts.includes(workoutId);
  };
  
  return {
    savedWorkouts,
    addWorkout,
    removeWorkout,
    isWorkoutSaved
  };
};

export default useWorkoutManagement;
