
import { supabase } from '@/integrations/supabase/client';
import type { HealthMetric } from './types/supabase';
import { HealthMetricType, DbHealthMetricType } from '@/utils/nutritionCalculations';

// Helper function to ensure metric type is valid for the database
const validateMetricType = (metricType: HealthMetricType | string): DbHealthMetricType => {
  // Only allow valid database enum values
  if (metricType === "steps" || metricType === "activity" || metricType === "heart-rate" || 
      metricType === "weight" || metricType === "height") {
    return metricType as DbHealthMetricType;
  }
  // Default to activity for any other types
  console.warn(`Invalid metric type: ${metricType}. Defaulting to 'activity'.`);
  return "activity";
};

export const useHealthMetrics = () => {
  const addHealthMetric = async (metric: { 
    metric_type: HealthMetricType | string; 
    value: string | number; 
    user_id?: string;
    source?: string;
  }): Promise<HealthMetric | null> => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // Validate metric type
    const validMetricType = validateMetricType(metric.metric_type);
    
    // Convert value to number if it's a string
    const numericValue = typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value;
    
    if (isNaN(numericValue)) {
      console.error("Invalid numeric value for health metric:", metric.value);
      return null;
    }

    const metricData = { 
      user_id: metric.user_id || session.user.id, 
      metric_type: validMetricType,
      value: numericValue 
    };
    
    // Add source if provided
    if (metric.source) {
      Object.assign(metricData, { source: metric.source });
    }

    const { data, error } = await supabase
      .from('health_metrics')
      .insert([metricData])
      .select()
      .single();

    if (error) {
      console.error("Error adding health metric:", error);
      throw error;
    }
    
    return data;
  };

  const getHealthMetrics = async (type: HealthMetricType | string): Promise<HealthMetric[]> => {
    if (!supabase) return [];

    // Validate the metric type before querying
    const validMetricType = validateMetricType(type);

    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('metric_type', validMetricType)
        .order('recorded_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${type} metrics:`, error);
      return [];
    }
  };

  return { addHealthMetric, getHealthMetrics };
};
