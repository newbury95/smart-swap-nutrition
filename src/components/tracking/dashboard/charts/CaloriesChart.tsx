
import React from "react";
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  CartesianGrid, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { NutritionData } from "../types/nutritionData";

interface CaloriesChartProps {
  data: NutritionData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CaloriesTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">
            {payload[0].payload.day}
          </span>
          <span className="font-bold">
            {`${payload[0].value} kcal`}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const CaloriesChart = ({ data }: CaloriesChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {React.createElement(
        AreaChart as any,
        { data },
        React.createElement(CartesianGrid as any, { strokeDasharray: "3 3", opacity: 0.3 }),
        React.createElement(XAxis as any, { dataKey: "day" }),
        React.createElement(YAxis as any),
        React.createElement(Tooltip as any, { content: <CaloriesTooltip /> }),
        React.createElement(Area as any, {
          type: "monotone",
          dataKey: "calories",
          stroke: "#22c55e",
          fill: "#22c55e",
          fillOpacity: 0.2,
          activeDot: { r: 8 },
          strokeWidth: 2,
          name: "Calories"
        })
      )}
    </ResponsiveContainer>
  );
};
