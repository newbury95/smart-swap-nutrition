
import { Flame } from "lucide-react";

interface CaloriesMetricProps {
  value: number;
}

export const CaloriesMetric = ({ value }: CaloriesMetricProps) => {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Flame className="w-5 h-5 text-primary-dark" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-800">Calories</h4>
          <p className="text-xl font-semibold">{value} kcal</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1">Synced with Apple Health / Samsung Health</p>
      </div>
    </div>
  );
};
