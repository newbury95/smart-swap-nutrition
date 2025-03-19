
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MacroProgressDisplayProps {
  consumedProtein: number;
  proteinTarget: number;
  proteinPercentage: number;
  consumedCarbs: number;
  carbsTarget: number;
  carbsPercentage: number;
  consumedFats: number;
  fatsTarget: number;
  fatsPercentage: number;
}

const MacroProgressDisplay = ({
  consumedProtein,
  proteinTarget,
  proteinPercentage,
  consumedCarbs,
  carbsTarget,
  carbsPercentage,
  consumedFats,
  fatsTarget,
  fatsPercentage
}: MacroProgressDisplayProps) => {
  return (
    <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Macro Nutrients Progress</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Protein ({consumedProtein}g of {proteinTarget}g)</span>
              <span className="font-medium text-gray-900">{proteinPercentage}%</span>
            </div>
            <Progress 
              value={proteinPercentage} 
              className="h-2 bg-gray-200" 
              indicatorClassName="bg-blue-600" 
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Carbs ({consumedCarbs}g of {carbsTarget}g)</span>
              <span className="font-medium text-gray-900">{carbsPercentage}%</span>
            </div>
            <Progress 
              value={carbsPercentage} 
              className="h-2 bg-gray-200" 
              indicatorClassName="bg-green-600" 
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Fats ({consumedFats}g of {fatsTarget}g)</span>
              <span className="font-medium text-gray-900">{fatsPercentage}%</span>
            </div>
            <Progress 
              value={fatsPercentage} 
              className="h-2 bg-gray-200" 
              indicatorClassName="bg-yellow-600" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(MacroProgressDisplay);
