
import { useCallback } from 'react';

export const useSaveHealthMetric = (
  isPremium: boolean,
  addHealthMetric: (metric: any) => Promise<void>,
  toast: any
) => {
  return useCallback(async (metricType: string, value: number | string | object) => {
    // Basic metrics (weight and height) should be available to all users
    if (!isPremium && 
        metricType !== 'weight' && 
        metricType !== 'height' && 
        metricType !== 'gender') {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to customize all health metrics',
      });
      return;
    }
    
    try {
      // Convert value to string for storage
      const stringValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : value.toString();
      
      await addHealthMetric({
        metric_type: metricType,
        value: stringValue,
      });
      
      console.log(`Successfully saved ${metricType} with value:`, stringValue);
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
