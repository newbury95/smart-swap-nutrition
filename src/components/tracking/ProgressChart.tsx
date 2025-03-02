
import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackingData, TimeRange } from "@/types/tracking";
import { useFormattedChartData } from "@/hooks/useFormattedChartData";

interface ProgressChartProps {
  data: TrackingData[];
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  isPremium: boolean;
}

const ProgressChart = ({
  data,
  timeRange,
  onTimeRangeChange,
  isPremium,
}: ProgressChartProps) => {
  const chartData = useFormattedChartData(data, timeRange);
  
  return (
    <Tabs value={timeRange} onValueChange={(value) => onTimeRangeChange(value as TimeRange)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Progress Tracking</h2>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={timeRange} className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* 
            Using React.createElement with type assertions to bypass TypeScript's 
            strict type checking for Recharts components
          */}
          {React.createElement(
            LineChart as any,
            { data: chartData },
            React.createElement(CartesianGrid as any, { strokeDasharray: "3 3" }),
            React.createElement(XAxis as any, { dataKey: "date" }),
            React.createElement(YAxis as any, { yAxisId: "left" }),
            React.createElement(YAxis as any, { yAxisId: "right", orientation: "right" }),
            React.createElement(Tooltip as any),
            React.createElement(Legend as any),
            React.createElement(Line as any, {
              yAxisId: "left",
              type: "monotone",
              dataKey: "bmi",
              name: "BMI",
              stroke: "#22c55e",
              strokeWidth: 2
            }),
            React.createElement(Line as any, {
              yAxisId: "right",
              type: "monotone",
              dataKey: "caloriesBurned",
              name: "Calories Burned",
              stroke: "#f97316",
              strokeWidth: 2
            }),
            React.createElement(Line as any, {
              yAxisId: "right",
              type: "monotone",
              dataKey: "steps",
              name: "Steps",
              stroke: "#3b82f6",
              strokeWidth: 2
            }),
            React.createElement(Line as any, {
              yAxisId: "left",
              type: "monotone",
              dataKey: "exerciseMinutes",
              name: "Exercise Mins",
              stroke: "#a855f7",
              strokeWidth: 2
            })
          )}
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
};

export default ProgressChart;
