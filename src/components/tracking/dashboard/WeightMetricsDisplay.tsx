
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Weight, Activity, ArrowRight, LineChart } from "lucide-react";
import { format } from "date-fns";

interface WeightMetricsDisplayProps {
  weight: number;
  height: number;
  weightHistory: { date: string; weight: number }[];
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
  return (
    <>
      <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Measurements</h2>
            <button 
              onClick={onUpdateClick}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Update <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Weight className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Current Weight</p>
                <p className="text-2xl font-bold text-blue-800">{weight} kg</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Current Height</p>
                <p className="text-2xl font-bold text-purple-800">{height} cm</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weight History</h2>
          
          {isWeightHistoryLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading weight history...</p>
            </div>
          ) : weightHistory.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No weight history available yet.</p>
                <p className="text-gray-400 text-sm">Update your measurements to start tracking.</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <div className="bg-gray-100 h-full rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-800 font-medium">Weight Chart</p>
                  <p className="text-gray-500 text-sm">
                    Latest: {weightHistory[0]?.weight} kg on {format(new Date(weightHistory[0]?.date), 'PP')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default memo(WeightMetricsDisplay);
