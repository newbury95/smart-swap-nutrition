
import React from "react";
import { ExerciseMetric } from "@/components/diary/metrics/ExerciseMetric";

export const HealthMetrics = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Health Integration</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        <ExerciseMetric />
      </div>
    </div>
  );
};
