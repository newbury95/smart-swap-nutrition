
import { useNavigate } from "react-router-dom";
import { useHealthMetricOperations } from "@/hooks/useHealthMetricOperations";
import { HeartRateMetric } from "./metrics/HeartRateMetric";
import { StepsMetric } from "./metrics/StepsMetric";
import { CaloriesMetric } from "./metrics/CaloriesMetric";
import { ExerciseMetric } from "./metrics/ExerciseMetric";

export const HealthMetrics = () => {
  const { getMetricValue, caloriesBurned } = useHealthMetricOperations();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h3 className="font-semibold text-gray-800 mb-4">Health Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HeartRateMetric value={getMetricValue('heart-rate')} />
        <StepsMetric value={getMetricValue('steps')} />
        <CaloriesMetric value={caloriesBurned} />
        <ExerciseMetric />
      </div>
    </div>
  );
};
