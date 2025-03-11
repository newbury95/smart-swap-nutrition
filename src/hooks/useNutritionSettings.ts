
import { useCallback } from 'react';
import type { NutritionSettings, MacroRatio } from './useUserNutrition';
import { 
  ActivityLevel,
  FitnessGoal,
  Gender,
  HealthMetricType
} from '@/utils/nutritionCalculations';

// Helper functions to validate types
const isValidActivityLevel = (value: string): value is ActivityLevel => {
  return ['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(value);
};

const isValidFitnessGoal = (value: string): value is FitnessGoal => {
  return ['weight_loss', 'maintenance', 'mass_building'].includes(value);
};

const isValidGender = (value: string): value is Gender => {
  return ['male', 'female', 'other'].includes(value);
};

export const useNutritionSettings = (
  settings: NutritionSettings,
  setSettings: React.Dispatch<React.SetStateAction<NutritionSettings>>,
  addHealthMetric: (metric: any) => Promise<void>,
  toast: any,
  isPremium: boolean
) => {
  // Load health metrics from Supabase
  const loadHealthMetrics = useCallback(async (getHealthMetrics: any) => {
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

  // Save health metrics to Supabase
  const saveHealthMetric = useCallback(async (metricType: string, value: number | string) => {
    if (!isPremium && metricType !== 'weight' && metricType !== 'height') {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to customize all health metrics',
      });
      return;
    }
    
    try {
      await addHealthMetric({
        metric_type: metricType,
        value: value.toString(),
      });
      
      toast({
        title: 'Success',
        description: 'Health metric updated successfully',
      });
    } catch (error) {
      console.error(`Error saving ${metricType}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to save ${metricType}`,
      });
    }
  }, [isPremium, addHealthMetric, toast]);

  // Update a specific setting
  const updateSetting = useCallback(async <K extends keyof NutritionSettings>(
    key: K, 
    value: NutritionSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Map settings key to metric type
    const metricTypeMap: Record<string, string> = {
      weight: 'weight',
      height: 'height',
      age: 'age',
      gender: 'gender',
      activityLevel: 'activity_level',
      fitnessGoal: 'fitness_goal',
    };
    
    // Save to database if it's a basic metric
    if (metricTypeMap[key]) {
      await saveHealthMetric(metricTypeMap[key], value as any);
    }
  }, [saveHealthMetric, setSettings]);

  // Update custom macro ratio (premium feature)
  const updateCustomMacroRatio = useCallback(async (macroRatio: MacroRatio) => {
    if (!isPremium) {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to set custom macro ratios',
      });
      return;
    }
    
    // Validate that ratios sum to 100%
    const sum = macroRatio.protein + macroRatio.carbs + macroRatio.fats;
    if (Math.abs(sum - 100) > 1) {
      toast({
        variant: 'destructive',
        title: 'Invalid Macro Ratio',
        description: 'Macro percentages must add up to 100%',
      });
      return;
    }
    
    setSettings(prev => ({ ...prev, customMacroRatio: macroRatio }));
    
    try {
      // Save each macro percentage as separate metrics
      await addHealthMetric({
        metric_type: 'custom_protein_ratio',
        value: macroRatio.protein.toString(),
      });
      
      await addHealthMetric({
        metric_type: 'custom_carbs_ratio',
        value: macroRatio.carbs.toString(),
      });
      
      await addHealthMetric({
        metric_type: 'custom_fats_ratio',
        value: macroRatio.fats.toString(),
      });
      
      toast({
        title: 'Success',
        description: 'Custom macro ratios updated',
      });
    } catch (error) {
      console.error('Error saving custom macro ratios:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save custom macro ratios',
      });
    }
  }, [isPremium, addHealthMetric, toast, setSettings]);

  return {
    loadHealthMetrics,
    updateSetting,
    updateCustomMacroRatio
  };
};
