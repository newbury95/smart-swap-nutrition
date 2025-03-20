
import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Activity, Target, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface NutritionSummaryCardsProps {
  bmr: number;
  calorieTarget: number;
  consumedCalories: number;
  remainingCalories: number;
  caloriePercentage: number;
  fitnessGoal: string;
  onChangeGoalClick: () => void;
  isGoalUpdating?: boolean;
}

const NutritionSummaryCards = ({
  bmr,
  calorieTarget,
  consumedCalories,
  remainingCalories,
  caloriePercentage,
  fitnessGoal,
  onChangeGoalClick,
  isGoalUpdating = false
}: NutritionSummaryCardsProps) => {
  // Format goal name for display
  const formattedGoal = fitnessGoal.replace('_', ' ');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="relative w-full bg-gradient-to-br from-purple-50 to-purple-100 p-6">
            <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-800">Basal Metabolic Rate</h3>
                <p className="text-3xl font-bold mt-2 text-purple-900">{bmr.toLocaleString()} kcal</p>
              </div>
              <div className="relative z-10">
                <div className="bg-white p-3 rounded-full">
                  <Flame className="w-10 h-10 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-purple-800">
              <span className="flex items-center">
                Your BMR is the calories your body needs at rest
                <Popover>
                  <PopoverTrigger>
                    <Info className="h-3.5 w-3.5 ml-1 text-purple-400 cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-xs p-3">
                    <p>Your Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain basic functions like breathing and circulation.</p>
                  </PopoverContent>
                </Popover>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Calorie Target</h3>
                <p className="text-3xl font-bold mt-2 text-blue-900">{calorieTarget.toLocaleString()} kcal</p>
              </div>
              <div className="relative z-10">
                <div className="bg-white p-3 rounded-full">
                  <Activity className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-800">Consumed</span>
                <span className="font-medium text-blue-900">{caloriePercentage}%</span>
              </div>
              <Progress 
                value={caloriePercentage} 
                className="h-2 bg-blue-200" 
                indicatorClassName={caloriePercentage > 100 ? "bg-red-500" : "bg-blue-600"} 
              />
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-b-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Consumed</span>
              <span className="font-medium">{consumedCalories.toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Remaining</span>
              <span className={cn(
                "font-medium",
                remainingCalories < 0 ? "text-red-500" : "text-blue-500"
              )}>
                {remainingCalories.toLocaleString()} kcal
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 p-6">
            <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Current Goal</h3>
                <p className="text-3xl font-bold mt-2 text-green-900 capitalize">
                  {formattedGoal}
                </p>
              </div>
              <div className="relative z-10">
                <div className="bg-white p-3 rounded-full">
                  <Target className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={onChangeGoalClick} 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium"
                disabled={isGoalUpdating}
              >
                {isGoalUpdating ? "Updating..." : "Change Goal"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(NutritionSummaryCards);
