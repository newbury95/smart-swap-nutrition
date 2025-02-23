
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TrackingData, TimeRange } from "../hooks/useTrackingData";

interface ProgressChartProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  trackingData: TrackingData[];
}

export const ProgressChart = ({
  timeRange,
  onTimeRangeChange,
  trackingData,
}: ProgressChartProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
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
            <LineChart data={trackingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bmi"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};
