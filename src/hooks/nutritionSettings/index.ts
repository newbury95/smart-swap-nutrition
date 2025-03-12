
import { useLoadHealthMetrics } from './useLoadHealthMetrics';
import { useUpdateSetting } from './useUpdateSetting';
import { useUpdateCustomMacroRatio } from './useUpdateCustomMacroRatio';
import type { NutritionSettings, MacroRatio } from '../useUserNutrition';

export const useNutritionSettings = (
  settings: NutritionSettings,
  setSettings: React.Dispatch<React.SetStateAction<NutritionSettings>>,
  addHealthMetric: (metric: any) => Promise<void>,
  toast: any,
  isPremium: boolean
) => {
  const loadHealthMetrics = useLoadHealthMetrics(settings, setSettings, toast);
  const updateSetting = useUpdateSetting(setSettings, isPremium, addHealthMetric, toast);
  const updateCustomMacroRatio = useUpdateCustomMacroRatio(isPremium, addHealthMetric, toast, setSettings);

  return {
    loadHealthMetrics,
    updateSetting,
    updateCustomMacroRatio
  };
};

export * from './types';
export * from './useLoadHealthMetrics';
export * from './useSaveHealthMetric';
export * from './useUpdateSetting';
export * from './useUpdateCustomMacroRatio';
