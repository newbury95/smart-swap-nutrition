
import { Activity, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  // Data validation to avoid displaying NaN
  const validBmr = isNaN(bmr) || bmr <= 0 ? 0 : bmr;
  const validTdee = isNaN(tdee) || tdee <= 0 ? 0 : tdee;
  
  // Activity factor calculation (tdee / bmr)
  const activityFactor = validBmr > 0 ? (validTdee / validBmr).toFixed(2) : "0";
  
  if (isLoading) {
    return (
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-t-lg">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-9 w-32 mb-4" />
          </div>
          <div className="p-4 bg-white rounded-b-lg">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="flex-1 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-t-lg">
          <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
          <div className="absolute -right-3 -bottom-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Daily Energy Expenditure</h3>
              <p className="text-3xl font-bold mt-2 text-blue-900">{validTdee} kcal</p>
            </div>
            <div className="relative z-10">
              <div className="bg-white p-3 rounded-full">
                <Flame className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-b-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Base Metabolic Rate</span>
            <span className="font-medium">{validBmr} kcal</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Activity Factor</span>
            <span className="font-medium text-blue-600">
              {activityFactor}x
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyExpenditureCard;
