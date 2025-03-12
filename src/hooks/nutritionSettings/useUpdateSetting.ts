
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
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Save to database if it's a basic metric
    if (metricTypeMap[key as string]) {
      // Handle special case for customRatio which needs to be stringified
      if (key === 'customRatio') {
        await saveHealthMetric(metricTypeMap[key as string], JSON.stringify(value));
      } else {
        await saveHealthMetric(metricTypeMap[key as string], value as any);
      }
    }
  }, [saveHealthMetric, setSettings]);
};
