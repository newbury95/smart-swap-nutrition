
import { supabase } from '@/integrations/supabase/client';
import type { HealthMetric } from './types/supabase';
import { HealthMetricType, DbHealthMetricType } from '@/utils/nutritionCalculations';

// Define a strict set of valid metric types
const VALID_METRIC_TYPES = new Set(['steps', 'activity', 'heart-rate', 'weight', 'height']);

// Helper function to ensure metric type is valid for the database
const validateMetricType = (metricType: HealthMetricType | string): DbHealthMetricType => {
  // Only allow valid database enum values
  if (VALID_METRIC_TYPES.has(metricType)) {
    return metricType as DbHealthMetricType;
  }
  
  // Instead of defaulting to 'activity', we'll handle other types appropriately
  // in the future we should add support for these types
  if (metricType === 'gender' || metricType === 'fitness_goal') {
    console.log(`Using custom storage for metric type: ${metricType}`);
    // We'll use 'activity' as placeholder but in future should have dedicated handling
  }
  
  // Default to activity for any other types
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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      // Special handling for non-standard metric types
      if (metric.metric_type === 'gender' || metric.metric_type === 'fitness_goal') {
        // For these special types, we would store them in user profiles instead
        // This reduces the console warnings
        const { error } = await supabase
          .from('profiles')
          .update({ [metric.metric_type]: metric.value })
          .eq('id', session.user.id);
          
        if (error) {
          console.error(`Error updating ${metric.metric_type}:`, error);
          throw error;
        }
        
        // Return a synthetic response
        return {
          id: 'profile-update',
          metric_type: 'activity',
          value: 0,
          recorded_at: new Date().toISOString(),
          source: 'profile'
        };
      }

      // Validate metric type for standard health metrics
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
        value: numericValue,
        source: metric.source || 'manual'
      };

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
    } catch (error) {
      console.error("Error in addHealthMetric:", error);
      throw error;
    }
  };

  const getHealthMetrics = async (type: HealthMetricType | string): Promise<HealthMetric[]> => {
    if (!supabase) return [];

    // Special handling for non-standard metric types
    if (type === 'gender' || type === 'fitness_goal') {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return [];
        
        const { data, error } = await supabase
          .from('profiles')
          .select(type)
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        // Return a synthetic metric for these special types
        if (data && data[type]) {
          return [{
            id: 'profile-data',
            metric_type: 'activity' as DbHealthMetricType,
            value: typeof data[type] === 'number' ? data[type] : 0,
            recorded_at: new Date().toISOString(),
            source: 'profile'
          }];
        }
        return [];
      } catch (error) {
        console.error(`Error fetching ${type} from profile:`, error);
        return [];
      }
    }

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
