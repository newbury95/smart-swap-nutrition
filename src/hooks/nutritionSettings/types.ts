
import type { NutritionSettings, MacroRatio } from '../useUserNutrition';
import { 
  ActivityLevel,
  FitnessGoal,
  Gender,
  HealthMetricType
} from '@/utils/nutritionCalculations';

// Helper functions to validate types
export const isValidActivityLevel = (value: string): value is ActivityLevel => {
  return ['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(value);
};

export const isValidFitnessGoal = (value: string): value is FitnessGoal => {
  return ['weight_loss', 'maintenance', 'mass_building'].includes(value);
};

export const isValidGender = (value: string): value is Gender => {
  return ['male', 'female', 'other'].includes(value);
};

// Mapping from settings keys to metric types
export const metricTypeMap: Record<string, string> = {
  weight: 'weight',
  height: 'height',
  age: 'age',
  gender: 'gender',
  activityLevel: 'activity_level',
  fitnessGoal: 'fitness_goal',
  customMacroRatio: 'custom_macro_ratio'
};
