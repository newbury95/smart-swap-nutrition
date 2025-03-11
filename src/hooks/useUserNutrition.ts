
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { useToast } from './use-toast';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateCalorieTarget, 
  calculateMacroGrams,
  defaultMacroRatios,
  ActivityLevel,
  FitnessGoal,
  Gender,
  MacroRatio
} from '@/utils/nutritionCalculations';

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
  const [calculations, setCalculations] = useState<NutritionCalculations>({
    bmr: 0,
    tdee: 0,
    calorieTarget: 0,
    macros: { protein: 0, carbs: 0, fats: 0 },
    macroRatios: defaultMacroRatios.maintenance,
  });
  const [loading, setLoading] = useState(true);

  // Load health metrics from Supabase
  useEffect(() => {
    const loadHealthMetrics = async () => {
      try {
        setLoading(true);
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
          newSettings.activityLevel = activityData[0].value as ActivityLevel;
        }
        
        if (goalData.length > 0) {
          newSettings.fitnessGoal = goalData[0].value as FitnessGoal;
        }
        
        if (genderData.length > 0) {
          newSettings.gender = genderData[0].value as Gender;
        }
        
        setSettings(newSettings);
      } catch (error) {
        console.error('Error loading health metrics:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load health data',
          description: 'Please try again later',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadHealthMetrics();
  }, [getHealthMetrics, toast]);

  // Calculate nutrition values whenever settings change
  useEffect(() => {
    const { weight, height, age, gender, activityLevel, fitnessGoal, customMacroRatio } = settings;
    
    // Calculate BMR, TDEE, and calorie target
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const calorieTarget = calculateCalorieTarget(tdee, fitnessGoal);
    
    // Use custom macro ratio if provided (for premium users) or default
    const macroRatios = customMacroRatio || defaultMacroRatios[fitnessGoal];
    
    // Calculate macros in grams
    const macros = calculateMacroGrams(calorieTarget, macroRatios);
    
    setCalculations({
      bmr,
      tdee,
      calorieTarget,
      macros,
      macroRatios,
    });
  }, [settings]);

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
  }, [saveHealthMetric]);

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
  }, [isPremium, addHealthMetric, toast]);

  return {
    loading,
    settings,
    calculations,
    isPremium,
    updateSetting,
    updateCustomMacroRatio,
  };
};
