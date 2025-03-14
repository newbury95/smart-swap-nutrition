
import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend
} from "recharts";
import { NutritionData } from "../types/nutritionData";

interface MacrosChartProps {
  data: NutritionData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const MacrosTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="text-sm font-medium mb-2">
          {payload[0]?.payload?.day}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.name}
              </span>
            </div>
            <span className="font-bold">
              {`${entry.value} g`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MacrosChart = ({ data }: MacrosChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={0} barCategoryGap={8}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={<MacrosTooltip />} />
        <Legend />
        <Bar
          dataKey="protein"
          fill="#ef4444"
          name="Protein (g)"
        />
        <Bar
          dataKey="carbs"
          fill="#3b82f6"
          name="Carbs (g)"
        />
        <Bar
          dataKey="fats"
          fill="#eab308"
          name="Fats (g)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
