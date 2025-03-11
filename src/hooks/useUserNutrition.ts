
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
import { useNutritionSettings } from './useNutritionSettings';

export interface NutritionSettings {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  customMacroRatio?: MacroRatio;
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
  
  const { calculations } = useNutritionCalculator(settings);
  const { 
    loadHealthMetrics, 
    updateSetting, 
    updateCustomMacroRatio 
  } = useNutritionSettings(settings, setSettings, addHealthMetric, toast, isPremium);

  // Load health metrics from Supabase
  useEffect(() => {
    loadHealthMetrics(getHealthMetrics).then(() => {
      setLoading(false);
    }).catch(error => {
      console.error('Error loading health metrics:', error);
      setLoading(false);
    });
  }, [getHealthMetrics, loadHealthMetrics]);

  return {
    loading,
    settings,
    calculations,
    isPremium,
    updateSetting,
    updateCustomMacroRatio,
  };
};
