
import { supabase } from './useSupabase';
import type { HealthMetric } from './types/supabase';

export const useHealthMetrics = () => {
  const addHealthMetric = async (metric: Omit<HealthMetric, 'id' | 'recorded_at'>) => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('health_metrics')
      .insert([{ ...metric, user_id: session.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getHealthMetrics = async (type: HealthMetric['metric_type']) => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('metric_type', type)
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data || [];
  };

  return { addHealthMetric, getHealthMetrics };
};
