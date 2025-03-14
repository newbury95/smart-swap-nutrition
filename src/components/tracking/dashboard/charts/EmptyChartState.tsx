
import React from "react";

export const EmptyChartState = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <p className="text-gray-500">No nutrition data available for this week</p>
      <p className="text-sm text-gray-400">Log your meals to see your progress</p>
    </div>
  );
};
