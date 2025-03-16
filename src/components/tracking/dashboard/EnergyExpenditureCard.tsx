
import { Activity, Flame, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

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
  const validBmr = isNaN(bmr) || bmr <= 0 ? 0 : Math.round(bmr);
  const validTdee = isNaN(tdee) || tdee <= 0 ? 0 : Math.round(tdee);
  
  // Activity factor calculation (tdee / bmr)
  const activityFactor = validBmr > 0 ? parseFloat((validTdee / validBmr).toFixed(2)) : 0;
  
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
    <Card className="flex-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-t-lg">
          <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
          <div className="absolute -right-3 -bottom-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Daily Energy Expenditure</h3>
              <p className="text-3xl font-bold mt-2 text-blue-900">{validTdee.toLocaleString()} kcal</p>
            </div>
            <div className="relative z-10">
              <div className="bg-white p-3 rounded-full">
                <Flame className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-b-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center">
              Base Metabolic Rate
              <Popover>
                <PopoverTrigger>
                  <Info className="h-3.5 w-3.5 ml-1 text-gray-400 cursor-help" />
                </PopoverTrigger>
                <PopoverContent className="w-80 text-xs p-3">
                  <p>Your Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain basic functions.</p>
                </PopoverContent>
              </Popover>
            </span>
            <span className="font-medium">{validBmr.toLocaleString()} kcal</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-500 flex items-center">
              Activity Factor
              <Popover>
                <PopoverTrigger>
                  <Info className="h-3.5 w-3.5 ml-1 text-gray-400 cursor-help" />
                </PopoverTrigger>
                <PopoverContent className="w-80 text-xs p-3">
                  <p>The Activity Factor multiplies your BMR based on your activity level to determine your Total Daily Energy Expenditure (TDEE).</p>
                </PopoverContent>
              </Popover>
            </span>
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
