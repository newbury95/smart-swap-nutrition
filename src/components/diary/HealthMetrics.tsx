
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
  const { isPremium } = useSupabase();

  const { data: metrics } = useQuery({
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div 
        onClick={() => handleMetricClick('activity')}
        className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-800">Activity</h4>
            <p className="text-2xl font-semibold">{getMetricValue('activity')} kcal</p>
          </div>
        </div>
      </div>

      <div 
        onClick={() => handleMetricClick('heart-rate')}
        className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Heart className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-800">Heart Rate</h4>
            <p className="text-2xl font-semibold">{getMetricValue('heart-rate')} bpm</p>
          </div>
        </div>
      </div>

      <div 
        onClick={() => handleMetricClick('steps')}
        className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Footprints className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-800">Steps</h4>
            <p className="text-2xl font-semibold">{getMetricValue('steps')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

