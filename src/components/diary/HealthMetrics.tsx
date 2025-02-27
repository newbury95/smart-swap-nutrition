
import { Activity, Heart, Footprints, Dumbbell, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type MetricType = 'activity' | 'heart-rate' | 'steps';

interface HealthMetric {
  metric_type: MetricType;
  value: number;
}

const getLatestMetrics = async (): Promise<HealthMetric[]> => {
  const { data, error } = await supabase
    .from('health_metrics')
    .select('metric_type, value')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .in('metric_type', ['activity', 'heart-rate', 'steps']);

  if (error) throw error;
  return data || [];
};

export const HealthMetrics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium, addHealthMetric } = useSupabase();
  const [caloriesBurned, setCaloriesBurned] = useState(() => {
    const storedCaloriesBurned = localStorage.getItem('caloriesBurned');
    return storedCaloriesBurned ? parseInt(storedCaloriesBurned) : 0;
  });

  const { data: metrics, refetch } = useQuery({
    queryKey: ['health-metrics'],
    queryFn: getLatestMetrics,
    enabled: isPremium,
  });

  const getMetricValue = (type: MetricType) => {
    const metric = metrics?.find(m => m.metric_type === type);
    return metric?.value || 0;
  };

  const handleMetricClick = (metric: string) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to access detailed health metrics tracking",
        variant: "destructive",
      });
      return;
    }
    navigate('/tracking', { state: { activeMetric: metric } });
  };

  const handleLogActivity = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track activity and calories",
        variant: "destructive",
      });
      return;
    }
    try {
      await addHealthMetric({
        metric_type: 'activity',
        value: 100,
        source: 'manual'
      });
      
      // Update local state
      const newCaloriesBurned = caloriesBurned + 100;
      setCaloriesBurned(newCaloriesBurned);
      
      // Update localStorage for other components
      localStorage.setItem('caloriesBurned', newCaloriesBurned.toString());
      
      // Refetch metrics
      refetch();
      
      toast({
        title: "Activity Logged",
        description: "Your calories burned have been recorded",
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log activity",
      });
    }
  };

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
        value: 1000,
        source: 'manual'
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
        value: 75,
        source: 'manual'
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h3 className="font-semibold text-gray-800 mb-4">Health Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Activity</h4>
              <p className="text-xl font-semibold">{getMetricValue('activity')} kcal</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Heart Rate</h4>
              <p className="text-xl font-semibold">{getMetricValue('heart-rate')} bpm</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Footprints className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Steps</h4>
              <p className="text-xl font-semibold">{getMetricValue('steps')}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Calories</h4>
              <p className="text-xl font-semibold">{caloriesBurned} kcal</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Dumbbell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Exercise</h4>
              <p className="text-xl font-semibold">Log</p>
            </div>
          </div>
          <div className="mt-2">
            <button
              onClick={() => navigate('/tracking')}
              className="w-full px-2 py-1 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
            >
              Log Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
