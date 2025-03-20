
import { useCallback } from 'react';
import type { NutritionSettings } from '../useUserNutrition';
import { ActivityLevel, FitnessGoal, Gender } from '@/utils/nutritionCalculations';

// Helper functions to validate enum values (previously in types.ts)
const isValidActivityLevel = (value: string): value is ActivityLevel => {
  return ['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(value);
};

const isValidFitnessGoal = (value: string): value is FitnessGoal => {
  return ['weight_loss', 'maintenance', 'mass_building'].includes(value);
};

const isValidGender = (value: string): value is Gender => {
  return ['male', 'female', 'other'].includes(value);
};

export const useLoadHealthMetrics = (
  settings: NutritionSettings,
  setSettings: React.Dispatch<React.SetStateAction<NutritionSettings>>,
  toast: any
) => {
  // Load health metrics from Supabase
  return useCallback(async (getHealthMetrics: any) => {
    try {
      const weightData = await getHealthMetrics('weight');
      const heightData = await getHealthMetrics('height');
      const ageData = await getHealthMetrics('age');
      const activityData = await getHealthMetrics('activity_level');
      const goalData = await getHealthMetrics('fitness_goal');
      const genderData = await getHealthMetrics('gender');
      
      // Update settings from database if available
      const newSettings = { ...settings };
      
      if (weightData.length > 0) {
        newSettings.weight = Number(weightData[0].value);
      }
      
      if (heightData.length > 0) {
        newSettings.height = Number(heightData[0].value);
      }
      
      if (ageData.length > 0) {
        newSettings.age = Number(ageData[0].value);
      }
      
      if (activityData.length > 0) {
        // Ensure proper type casting for ActivityLevel
        const activityValue = activityData[0].value.toString();
        if (isValidActivityLevel(activityValue)) {
          newSettings.activityLevel = activityValue;
        }
      }
      
      if (goalData.length > 0) {
        // Ensure proper type casting for FitnessGoal
        const goalValue = goalData[0].value.toString();
        if (isValidFitnessGoal(goalValue)) {
          newSettings.fitnessGoal = goalValue;
        }
      }
      
      if (genderData.length > 0) {
        // Ensure proper type casting for Gender
        const genderValue = genderData[0].value.toString();
        if (isValidGender(genderValue)) {
          newSettings.gender = genderValue;
        }
      }
      
      setSettings(newSettings);
    } catch (error) {
      console.error('Error loading health metrics:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load health data',
        description: 'Please try again later',
      });
      throw error;
    }
  }, [settings, setSettings, toast]);
};
