
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EnergyExpenditureCardProps {
  bmr: number;
  tdee: number;
}

const EnergyExpenditureCard = ({ bmr, tdee }: EnergyExpenditureCardProps) => {
  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Energy Expenditure</h3>
          <Activity className="w-6 h-6 text-blue-500" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">BMR (Basal Metabolic Rate)</span>
              <span className="font-medium">{bmr} kcal</span>
            </div>
            <Progress value={bmr / tdee * 100} 
              className="h-2" indicatorClassName="bg-blue-500" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">TDEE (Total Daily)</span>
              <span className="font-medium">{tdee} kcal</span>
            </div>
            <Progress value={100} className="h-2" 
              indicatorClassName="bg-purple-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyExpenditureCard;
