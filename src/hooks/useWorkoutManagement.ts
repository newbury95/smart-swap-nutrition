
import { useState, useEffect } from 'react';
import { Workout } from '@/pages/premium/data/workoutData';
import { useAuth } from './useAuth';

export const useWorkoutManagement = () => {
  const { user } = useAuth();
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  
  // Load saved workouts from localStorage on component mount
  useEffect(() => {
    if (user) {
      const storedWorkouts = localStorage.getItem(`user_workouts_${user.id}`);
      if (storedWorkouts) {
        try {
          setSavedWorkouts(JSON.parse(storedWorkouts));
        } catch (error) {
          console.error('Error parsing saved workouts:', error);
          localStorage.removeItem(`user_workouts_${user.id}`);
        }
      }
    }
  }, [user]);
  
  // Save workouts to localStorage whenever they change
  useEffect(() => {
    if (user && savedWorkouts.length > 0) {
      localStorage.setItem(`user_workouts_${user.id}`, JSON.stringify(savedWorkouts));
    }
  }, [savedWorkouts, user]);
  
  const addWorkout = (workout: Workout) => {
    setSavedWorkouts(prevWorkouts => {
      // Check if workout already exists
      const exists = prevWorkouts.some(w => w.id === workout.id);
      if (exists) {
        return prevWorkouts;
      }
      return [...prevWorkouts, workout];
    });
  };
  
  const removeWorkout = (workoutId: string) => {
    setSavedWorkouts(prevWorkouts => 
      prevWorkouts.filter(workout => workout.id !== workoutId)
    );
  };
  
  const clearWorkouts = () => {
    setSavedWorkouts([]);
    if (user) {
      localStorage.removeItem(`user_workouts_${user.id}`);
    }
  };
  
  return {
    savedWorkouts,
    addWorkout,
    removeWorkout,
    clearWorkouts
  };
};
