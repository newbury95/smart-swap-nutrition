
import { motion } from "framer-motion";
import { Apple } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CalorieTargetCardProps {
  calorieTarget: number;
  currentCalories: number;
}

const CalorieTargetCard = ({ calorieTarget, currentCalories }: CalorieTargetCardProps) => {
  // Calculate percentage progress for calories
  const caloriePercentage = Math.min(
    Math.round((currentCalories / calorieTarget) * 100),
    100
  );
  
  return (
    <Card className="flex-1 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-t-lg">
          <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
          <div className="absolute -right-3 -bottom-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Daily Calorie Target</h3>
              <p className="text-3xl font-bold mt-2 text-green-900">{calorieTarget} kcal</p>
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
            <span className="font-medium">{currentCalories} kcal</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Remaining</span>
            <span className={cn(
              "font-medium",
              calorieTarget - currentCalories < 0 ? "text-red-500" : "text-green-500"
            )}>
              {calorieTarget - currentCalories} kcal
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieTargetCard;
