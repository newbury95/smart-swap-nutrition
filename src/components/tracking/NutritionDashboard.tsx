
import { motion } from "framer-motion";
import { Apple, Target, Activity, Scale, Ruler, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NutritionCalculations } from "@/hooks/useUserNutrition";
import { cn } from "@/lib/utils";

interface NutritionDashboardProps {
  calculations: NutritionCalculations;
  currentCalories: number;
  currentMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

const NutritionDashboard = ({
  calculations,
  currentCalories,
  currentMacros,
}: NutritionDashboardProps) => {
  const { calorieTarget, macros, macroRatios } = calculations;
  
  // Calculate percentage progress for calories and macros
  const caloriePercentage = Math.min(
    Math.round((currentCalories / calorieTarget) * 100),
    100
  );
  
  const proteinPercentage = Math.min(
    Math.round((currentMacros.protein / macros.protein) * 100),
    100
  );
  
  const carbsPercentage = Math.min(
    Math.round((currentMacros.carbs / macros.carbs) * 100),
    100
  );
  
  const fatsPercentage = Math.min(
    Math.round((currentMacros.fats / macros.fats) * 100),
    100
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main calorie target card with apple icon */}
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

        {/* BMR and TDEE card */}
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
                  <span className="font-medium">{calculations.bmr} kcal</span>
                </div>
                <Progress value={calculations.bmr / calculations.tdee * 100} 
                  className="h-2" indicatorClassName="bg-blue-500" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">TDEE (Total Daily)</span>
                  <span className="font-medium">{calculations.tdee} kcal</span>
                </div>
                <Progress value={100} className="h-2" 
                  indicatorClassName="bg-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macros tracking */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Macronutrient Targets</h3>
            <BarChart2 className="w-6 h-6 text-indigo-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Protein progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span>Protein ({macroRatios.protein}%)</span>
                </div>
                <span className="font-medium">
                  {currentMacros.protein}g / {macros.protein}g
                </span>
              </div>
              <Progress value={proteinPercentage} className="h-2" 
                indicatorClassName="bg-red-400" />
            </div>
            
            {/* Carbs progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  <span>Carbs ({macroRatios.carbs}%)</span>
                </div>
                <span className="font-medium">
                  {currentMacros.carbs}g / {macros.carbs}g
                </span>
              </div>
              <Progress value={carbsPercentage} className="h-2" 
                indicatorClassName="bg-blue-400" />
            </div>
            
            {/* Fats progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span>Fats ({macroRatios.fats}%)</span>
                </div>
                <span className="font-medium">
                  {currentMacros.fats}g / {macros.fats}g
                </span>
              </div>
              <Progress value={fatsPercentage} className="h-2" 
                indicatorClassName="bg-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NutritionDashboard;
