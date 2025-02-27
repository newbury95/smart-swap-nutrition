
import { Heart } from "lucide-react";
import { MetricType } from "@/hooks/useHealthMetricOperations";

interface HeartRateMetricProps {
  value: number;
}

export const HeartRateMetric = ({ value }: HeartRateMetricProps) => {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <Heart className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-800">Heart Rate</h4>
          <p className="text-xl font-semibold">{value} bpm</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
      </div>
    </div>
  );
};
