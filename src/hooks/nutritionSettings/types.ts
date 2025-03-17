
import { ActivityLevel, FitnessGoal, Gender } from '@/utils/nutritionCalculations';

// Mapping from settings keys to health metric types in the database
export const metricTypeMap: Record<string, string> = {
  weight: 'weight',
  height: 'height', 
  age: 'age',
  activityLevel: 'activity_level',
  fitnessGoal: 'fitness_goal',
  gender: 'gender',
  customMacroRatio: 'custom_macro_ratio',
  calorieTarget: 'calorie_target' // Ensure calorie target mapping is available
};

// Type validation helpers
export const isValidActivityLevel = (value: string): value is ActivityLevel => {
  return ['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(value);
};

export const isValidFitnessGoal = (value: string): value is FitnessGoal => {
  return ['weight_loss', 'maintenance', 'mass_building'].includes(value);
};

export const isValidGender = (value: string): value is Gender => {
  return ['male', 'female', 'other'].includes(value);
};
