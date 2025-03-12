
import { useCallback } from 'react';
import type { MacroRatio } from '../useUserNutrition';

export const useUpdateCustomMacroRatio = (
  isPremium: boolean,
  addHealthMetric: (metric: any) => Promise<void>,
  toast: any,
  setSettings: React.Dispatch<React.SetStateAction<any>>
) => {
  return useCallback(async (macroRatio: MacroRatio) => {
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
};
