
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the types
export type MetricType = 'heart-rate' | 'steps' | 'activity';

export interface HealthMetric {
  metric_type: MetricType;
  value: number;
}

// Function to fetch latest metrics from Supabase
const getLatestMetrics = async (): Promise<HealthMetric[]> => {
  const { data, error } = await supabase
    .from('health_metrics')
    .select('metric_type, value')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .in('metric_type', ['heart-rate', 'steps']);

  if (error) throw error;
  return data || [];
};

export const useHealthMetricOperations = () => {
  const { toast } = useToast();
  const { isPremium, addHealthMetric } = useSupabase();
  const [caloriesBurned, setCaloriesBurned] = useState(() => {
    const storedCaloriesBurned = localStorage.getItem('caloriesBurned');
    return storedCaloriesBurned ? parseInt(storedCaloriesBurned) : 0;
  });

  // Query to fetch health metrics
  const { data: metrics, refetch } = useQuery({
    queryKey: ['health-metrics'],
    queryFn: getLatestMetrics,
    enabled: isPremium,
  });

  // Helper function to get a specific metric value
  const getMetricValue = (type: MetricType) => {
    const metric = metrics?.find(m => m.metric_type === type);
    return metric?.value || 0;
  };

  // Function to log steps
  const handleLogSteps = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track steps",
        variant: "destructive",
      });
      return;
    }
    try {
      await addHealthMetric({
        metric_type: 'steps',
        value: '1000' // Convert to string to match expected type
      });
      refetch();
      toast({
        title: "Steps Logged",
        description: "Your steps have been recorded",
      });
    } catch (error) {
      console.error('Error logging steps:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log steps",
      });
    }
  };

  // Function to log heart rate
  const handleLogHeartRate = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track heart rate",
        variant: "destructive",
      });
      return;
    }
    try {
      await addHealthMetric({
        metric_type: 'heart-rate',
        value: '75' // Convert to string to match expected type
      });
      refetch();
      toast({
        title: "Heart Rate Logged",
        description: "Your heart rate has been recorded",
      });
    } catch (error) {
      console.error('Error logging heart rate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log heart rate",
      });
    }
  };

  return {
    isPremium,
    metrics,
    getMetricValue,
    handleLogSteps,
    handleLogHeartRate,
    caloriesBurned
  };
};
