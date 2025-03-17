
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { useToast } from './use-toast';
import { 
  ActivityLevel,
  FitnessGoal,
  Gender,
  MacroRatio,
  HealthMetricType
} from '@/utils/nutritionCalculations';
import { useNutritionCalculator } from './useNutritionCalculator';
import { useNutritionSettings } from './nutritionSettings';

export interface NutritionSettings {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  customMacroRatio?: MacroRatio;
  calorieTarget?: number; // Add direct calorie target setting
}

export interface NutritionCalculations {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  macroRatios: MacroRatio;
}

// Re-export MacroRatio type for use in other components
export type { MacroRatio };

const DEFAULT_SETTINGS: NutritionSettings = {
  age: 30,
  weight: 70,
  height: 170,
  gender: 'male',
  activityLevel: 'moderate',
  fitnessGoal: 'maintenance',
};

export const useUserNutrition = () => {
  const { toast } = useToast();
  const { isPremium, addHealthMetric, getHealthMetrics } = useSupabase();
  const [settings, setSettings] = useState<NutritionSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { calculations } = useNutritionCalculator(settings);
  const { 
    loadHealthMetrics, 
    updateSetting, 
    updateCustomMacroRatio 
  } = useNutritionSettings(settings, setSettings, addHealthMetric, toast, isPremium);

  // Function to validate settings and reset invalid ones to defaults
  const validateAndFixSettings = useCallback((currentSettings: NutritionSettings): NutritionSettings => {
    const fixedSettings = { ...currentSettings };
    let hasFixed = false;

    // Check numeric values
    if (typeof fixedSettings.age !== 'number' || isNaN(fixedSettings.age) || fixedSettings.age <= 0) {
      console.warn('Invalid age detected, resetting to default:', fixedSettings.age);
      fixedSettings.age = DEFAULT_SETTINGS.age;
      hasFixed = true;
    }

    if (typeof fixedSettings.weight !== 'number' || isNaN(fixedSettings.weight) || fixedSettings.weight <= 0) {
      console.warn('Invalid weight detected, resetting to default:', fixedSettings.weight);
      fixedSettings.weight = DEFAULT_SETTINGS.weight;
      hasFixed = true;
    }

    if (typeof fixedSettings.height !== 'number' || isNaN(fixedSettings.height) || fixedSettings.height <= 0) {
      console.warn('Invalid height detected, resetting to default:', fixedSettings.height);
      fixedSettings.height = DEFAULT_SETTINGS.height;
      hasFixed = true;
    }

    // Check enum values
    const validGenders: Gender[] = ['male', 'female', 'other'];
    if (!validGenders.includes(fixedSettings.gender)) {
      console.warn('Invalid gender detected, resetting to default:', fixedSettings.gender);
      fixedSettings.gender = DEFAULT_SETTINGS.gender;
      hasFixed = true;
    }

    const validActivityLevels: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    if (!validActivityLevels.includes(fixedSettings.activityLevel)) {
      console.warn('Invalid activity level detected, resetting to default:', fixedSettings.activityLevel);
      fixedSettings.activityLevel = DEFAULT_SETTINGS.activityLevel;
      hasFixed = true;
    }

    const validFitnessGoals: FitnessGoal[] = ['weight_loss', 'maintenance', 'mass_building'];
    if (!validFitnessGoals.includes(fixedSettings.fitnessGoal)) {
      console.warn('Invalid fitness goal detected, resetting to default:', fixedSettings.fitnessGoal);
      fixedSettings.fitnessGoal = DEFAULT_SETTINGS.fitnessGoal;
      hasFixed = true;
    }

    // Check custom macro ratio if present
    if (fixedSettings.customMacroRatio) {
      const { protein, carbs, fats } = fixedSettings.customMacroRatio;
      
      if (typeof protein !== 'number' || isNaN(protein) || protein < 0 || 
          typeof carbs !== 'number' || isNaN(carbs) || carbs < 0 || 
          typeof fats !== 'number' || isNaN(fats) || fats < 0) {
        console.warn('Invalid custom macro ratio detected, removing:', fixedSettings.customMacroRatio);
        delete fixedSettings.customMacroRatio;
        hasFixed = true;
      } else {
        // Check if the total is reasonably close to 100%
        const total = protein + carbs + fats;
        if (total < 95 || total > 105) {
          console.warn('Custom macro ratio total not close to 100%, adjusting:', total);
          // Normalize to 100%
          fixedSettings.customMacroRatio = {
            protein: Math.round((protein / total) * 100),
            carbs: Math.round((carbs / total) * 100),
            fats: Math.round((fats / total) * 100)
          };
          hasFixed = true;
        }
      }
    }

    if (hasFixed) {
      console.info('Settings were fixed to prevent crashes:', fixedSettings);
    }

    return fixedSettings;
  }, []);

  // Load health metrics from Supabase
  useEffect(() => {
    setError(null);
    
    loadHealthMetrics(getHealthMetrics)
      .then(() => {
        // Validate settings after loading
        setSettings(prev => validateAndFixSettings(prev));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading health metrics:', err);
        setError('Failed to load your health data. Using default settings.');
        // Still update settings with defaults to prevent crashes
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
      });
  }, [getHealthMetrics, loadHealthMetrics, validateAndFixSettings]);

  // Safe setter for settings that validates before setting
  const setSafeSettings = useCallback((newSettings: Partial<NutritionSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return validateAndFixSettings(updated);
    });
  }, [validateAndFixSettings]);

  // Wrap the updateSetting function to include validation
  const safeUpdateSetting = useCallback(async <K extends keyof NutritionSettings>(
    key: K, 
    value: NutritionSettings[K]
  ) => {
    try {
      // Pre-validate the value
      if (value === undefined || value === null) {
        console.error(`Invalid value for setting "${key}":`, value);
        toast({
          variant: 'destructive',
          title: 'Invalid value',
          description: `Could not update ${key} with invalid value.`,
        });
        return;
      }
      
      // For numeric fields, ensure they're numbers and positive
      if (['age', 'weight', 'height'].includes(key as string)) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          toast({
            variant: 'destructive',
            title: 'Invalid value',
            description: `${key} must be a positive number.`,
          });
          return;
        }
      }
      
      // Now update the setting
      await updateSetting(key, value);
    } catch (error) {
      console.error(`Error in safeUpdateSetting for "${key}":`, error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: `Failed to update ${key}. Please try again.`,
      });
    }
  }, [updateSetting, toast]);

  return {
    loading,
    settings,
    calculations,
    isPremium,
    error,
    updateSetting: safeUpdateSetting,
    updateCustomMacroRatio,
    setSettings: setSafeSettings,
  };
};
