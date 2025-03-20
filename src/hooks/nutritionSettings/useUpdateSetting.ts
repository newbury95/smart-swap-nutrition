
import { useCallback } from 'react';
import type { NutritionSettings } from '../useUserNutrition';
import { metricTypeMap } from './types';
import { useSaveHealthMetric } from './useSaveHealthMetric';

export const useUpdateSetting = (
  setSettings: React.Dispatch<React.SetStateAction<NutritionSettings>>,
  isPremium: boolean,
  addHealthMetric: (metric: any) => Promise<void>,
  toast: any
) => {
  const saveHealthMetric = useSaveHealthMetric(isPremium, addHealthMetric, toast);

  return useCallback(async <K extends keyof NutritionSettings>(
    key: K, 
    value: NutritionSettings[K]
  ) => {
    console.log(`Updating setting "${key}" to:`, value);
    
    // Validate input (basic validation)
    if (value === undefined || value === null) {
      console.error(`Invalid value for setting "${key}":`, value);
      return;
    }
    
    // Immediately update the state
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Save to database if it's a basic metric and we have a type mapping for it
    if (metricTypeMap[key as string]) {
      try {
        console.log(`Saving "${key}" to database as metric type "${metricTypeMap[key as string]}" with value:`, value);
        
        // Handle special case for customMacroRatio which needs to be stringified
        if (key === 'customMacroRatio') {
          await saveHealthMetric(metricTypeMap[key as string], JSON.stringify(value));
        } else {
          await saveHealthMetric(metricTypeMap[key as string], value as any);
        }
        
        console.log(`Successfully saved "${key}" to database`);
      } catch (error) {
        console.error(`Error saving setting "${key}" to database:`, error);
      }
    }
  }, [saveHealthMetric, setSettings]);
};
