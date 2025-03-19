
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale, Ruler, AreaChart } from "lucide-react";
import { calculateBMI, getBMICategory } from "@/utils/healthCalculations";

interface WeightMetricsDisplayProps {
  weight: number;
  height: number;
  weightHistory: {date: string, weight: number}[];
  isWeightHistoryLoading: boolean;
  onUpdateClick: () => void;
}

const WeightMetricsDisplay = ({
  weight,
  height,
  weightHistory,
  isWeightHistoryLoading,
  onUpdateClick
}: WeightMetricsDisplayProps) => {
  // Calculate BMI from the latest measurements
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  
  // Format data for recent weight changes
  const lastWeight = weightHistory.length > 1 ? weightHistory[1].weight : weight;
  const weightChange = weight - lastWeight;
  const hasWeightChange = weightHistory.length > 1;
  
  return (
    <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current Measurements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Weight</p>
              <p className="text-2xl font-semibold">{weight} kg</p>
              
              {isWeightHistoryLoading ? (
                <Skeleton className="h-5 w-24 mt-1" />
              ) : hasWeightChange ? (
                <p className={`text-sm ${weightChange > 0 ? 'text-red-500' : weightChange < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </p>
              ) : (
                <p className="text-sm text-gray-500">No previous data</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Ruler className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Height</p>
              <p className="text-2xl font-semibold">{height} cm</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <AreaChart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">BMI</p>
              <p className="text-2xl font-semibold">{bmi.toFixed(1)}</p>
              <p className="text-sm" style={{ color: getBmiStatusColor(bmiCategory) }}>
                {bmiCategory}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={onUpdateClick}
            variant="outline"
            className="w-full"
          >
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get color based on BMI category
const getBmiStatusColor = (status: string): string => {
  switch (status) {
    case 'Underweight':
      return '#F59E0B'; // Amber
    case 'Normal weight':
      return '#10B981'; // Green
    case 'Overweight':
      return '#F97316'; // Orange
    case 'Obese':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
};

export default memo(WeightMetricsDisplay);
