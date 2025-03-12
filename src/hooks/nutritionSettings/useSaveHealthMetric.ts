
import { useCallback } from 'react';

export const useSaveHealthMetric = (
  isPremium: boolean,
  addHealthMetric: (metric: any) => Promise<void>,
  toast: any
) => {
  return useCallback(async (metricType: string, value: number | string) => {
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
};
