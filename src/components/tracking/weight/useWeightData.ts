
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWeightData = () => {
  const { toast } = useToast();
  const [weightHistory, setWeightHistory] = useState<{date: string, weight: number}[]>([]);
  const [isWeightHistoryLoading, setIsWeightHistoryLoading] = useState(true);
  
  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        setIsWeightHistoryLoading(true);
        const { data: weightData, error } = await supabase
          .from('health_metrics')
          .select('value, recorded_at')
          .eq('metric_type', 'weight')
          .order('recorded_at', { ascending: false })
          .limit(30);
        
        if (error) throw error;
        
        const history = weightData?.map(record => ({
          date: format(new Date(record.recorded_at), 'yyyy-MM-dd'),
          weight: Number(record.value)
        })) || [];
        
        setWeightHistory(history);
        console.log("Weight history loaded:", history);
      } catch (error) {
        console.error("Error fetching weight history:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load weight history",
        });
      } finally {
        setIsWeightHistoryLoading(false);
      }
    };
    
    fetchWeightHistory();
  }, [toast]);
  
  // Function to add a new weight record to the history
  const addWeightRecord = (weight: number) => {
    setWeightHistory(prev => [{
      date: format(new Date(), 'yyyy-MM-dd'),
      weight
    }, ...prev]);
  };
  
  return { weightHistory, isWeightHistoryLoading, addWeightRecord };
};
