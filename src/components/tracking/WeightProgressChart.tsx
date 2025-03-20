
import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Scale, ArrowUp, ArrowDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, subYears, subWeeks, isAfter } from "date-fns";

type TimeFrame = "weekly" | "monthly" | "yearly";

interface WeightProgressChartProps {
  weightHistory: { date: string; weight: number }[];
  isLoading: boolean;
}

const WeightProgressChart = ({
  weightHistory,
  isLoading,
}: WeightProgressChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("weekly");

  // Filter and format the chart data based on the selected time frame
  const getFilteredChartData = () => {
    if (!weightHistory.length) return [];

    const now = new Date();
    let filterDate: Date;

    switch (timeFrame) {
      case "weekly":
        filterDate = subWeeks(now, 8); // Show last 8 weeks
        break;
      case "monthly":
        filterDate = subMonths(now, 12); // Show last 12 months
        break;
      case "yearly":
        filterDate = subYears(now, 3); // Show last 3 years
        break;
      default:
        filterDate = subWeeks(now, 8);
    }

    // Sort chronologically and filter by date
    const sortedData = [...weightHistory]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter(entry => isAfter(new Date(entry.date), filterDate));

    return sortedData.map(entry => ({
      ...entry,
      date: formatDateByTimeFrame(entry.date, timeFrame),
    }));
  };

  const formatDateByTimeFrame = (dateString: string, timeFrame: TimeFrame) => {
    const date = new Date(dateString);
    
    switch (timeFrame) {
      case "weekly":
        return format(date, "do MMM");
      case "monthly":
        return format(date, "MMM yyyy");
      case "yearly":
        return format(date, "yyyy");
      default:
        return dateString;
    }
  };

  const chartData = getFilteredChartData();
  
  // Calculate weight change if data is available
  const weightChange = chartData.length >= 2 
    ? chartData[chartData.length - 1].weight - chartData[0].weight 
    : 0;
  
  const isWeightLoss = weightChange < 0;
  const changeLabel = isWeightLoss 
    ? `Lost ${Math.abs(weightChange).toFixed(1)} kg` 
    : weightChange > 0 
      ? `Gained ${weightChange.toFixed(1)} kg` 
      : "No change";

  if (isLoading) {
    return (
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weight Progress</h2>
            <div className="bg-gray-200 h-10 w-32 rounded animate-pulse"></div>
          </div>
          <div className="h-[250px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Weight Progress</h2>
            </div>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </div>

          {chartData.length > 0 ? (
            <>
              <div className="flex items-center mb-4 text-sm">
                <div className={`flex items-center ${isWeightLoss ? 'text-green-500' : weightChange > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {isWeightLoss ? <ArrowDown className="h-4 w-4 mr-1" /> : 
                   weightChange > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : null}
                  <span className="font-medium">{changeLabel}</span>
                </div>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-500">
                  {chartData.length} data points
                </span>
              </div>

              <TabsContent value={timeFrame} className="mt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickLine={false}
                        axisLine={true} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value} kg`}
                        domain={['dataMin - 1', 'dataMax + 1']}
                      />
                      <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] bg-gray-50 rounded-lg">
              <Scale className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                No weight history data available.
                <br />
                Update your measurements to start tracking progress.
              </p>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default memo(WeightProgressChart);
