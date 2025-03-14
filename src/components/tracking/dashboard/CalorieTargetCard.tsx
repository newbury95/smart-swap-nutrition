
import { motion } from "framer-motion";
import { Apple } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CalorieTargetCardProps {
  calorieTarget: number;
  currentCalories: number;
  isLoading?: boolean;
}

const CalorieTargetCard = ({ 
  calorieTarget = 0, 
  currentCalories = 0, 
  isLoading = false 
}: CalorieTargetCardProps) => {
  // Use default value of 0 if invalid input
  const validCalorieTarget = isNaN(calorieTarget) || calorieTarget <= 0 ? 2000 : calorieTarget;
  const validCurrentCalories = isNaN(currentCalories) || currentCalories < 0 ? 0 : currentCalories;
  
  // Calculate percentage progress for calories (with validation)
  const caloriePercentage = Math.min(
    Math.round((validCurrentCalories / validCalorieTarget) * 100),
    100
  );
  
  if (isLoading) {
    return (
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-t-lg">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-9 w-32 mb-4" />
            <Skeleton className="h-6 w-full" />
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
        <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-t-lg">
          <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
          <div className="absolute -right-3 -bottom-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Daily Calorie Target</h3>
              <p className="text-3xl font-bold mt-2 text-green-900">{validCalorieTarget} kcal</p>
            </div>
            <div className="relative z-10">
              <div className="bg-white p-3 rounded-full">
                <Apple className="w-10 h-10 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-800">Progress</span>
              <span className="font-medium text-green-900">{caloriePercentage}%</span>
            </div>
            <Progress value={caloriePercentage} className="h-2 bg-green-200" 
              indicatorClassName="bg-green-600" />
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-b-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Current</span>
            <span className="font-medium">{validCurrentCalories} kcal</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Remaining</span>
            <span className={cn(
              "font-medium",
              validCalorieTarget - validCurrentCalories < 0 ? "text-red-500" : "text-green-500"
            )}>
              {validCalorieTarget - validCurrentCalories} kcal
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieTargetCard;
