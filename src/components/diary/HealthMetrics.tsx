
import { Activity, Heart, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <button 
              onClick={() => handleMetricClick('activity')}
              className="w-full px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              View Details
            </button>
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
            <button
              onClick={handleLogHeartRate}
              className="w-full px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              Log Heart Rate
            </button>
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
            <button
              onClick={handleLogSteps}
              className="w-full px-2 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
            >
              Log Steps (+1000)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
