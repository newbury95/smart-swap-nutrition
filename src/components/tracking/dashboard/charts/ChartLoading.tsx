
import React from "react";
import { BarChart2 } from "lucide-react";

export const ChartLoading = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <BarChart2 className="h-16 w-16 animate-pulse text-gray-300" />
    </div>
  );
};
