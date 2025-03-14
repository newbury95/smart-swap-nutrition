
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface EnergyExpenditureCardProps {
  bmr: number;
  tdee: number;
  isLoading?: boolean;
}

const EnergyExpenditureCard = ({ 
  bmr = 0, 
  tdee = 0,
  isLoading = false
}: EnergyExpenditureCardProps) => {
  // Validate inputs to avoid NaN or infinity
  const validBmr = isNaN(bmr) || bmr <= 0 ? 1500 : bmr;
  const validTdee = isNaN(tdee) || tdee <= 0 ? 2000 : tdee;
  
  // Avoid division by zero
  const bmrPercentage = validTdee > 0 ? Math.min((validBmr / validTdee) * 100, 100) : 0;
  
  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
              <span className="font-medium">{validBmr} kcal</span>
            </div>
            <Progress value={bmrPercentage} 
              className="h-2" indicatorClassName="bg-blue-500" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">TDEE (Total Daily)</span>
              <span className="font-medium">{validTdee} kcal</span>
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
