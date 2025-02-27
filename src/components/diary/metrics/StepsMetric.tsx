
import { Footprints } from "lucide-react";

interface StepsMetricProps {
  value: number;
}

export const StepsMetric = ({ value }: StepsMetricProps) => {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Footprints className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-800">Steps</h4>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
      </div>
    </div>
  );
};
