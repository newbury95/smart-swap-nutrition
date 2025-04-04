
import { useState } from "react";
import { Apple, Settings, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { NutritionSettings, MacroRatio } from "@/hooks/useUserNutrition";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import CalorieSettingsDialog from "./CalorieSettingsDialog";

interface CalorieTargetCardProps {
  calorieTarget: number;
  currentCalories: number;
  settings: NutritionSettings;
  isPremium: boolean;
  onUpdateSetting: <K extends keyof NutritionSettings>(key: K, value: NutritionSettings[K]) => Promise<void>;
  onUpdateCustomMacroRatio: (ratio: MacroRatio) => Promise<void>;
  isLoading?: boolean;
}

const CalorieTargetCard = ({ 
  calorieTarget = 0, 
  currentCalories = 0, 
  settings,
  isPremium,
  onUpdateSetting,
  onUpdateCustomMacroRatio,
  isLoading = false 
}: CalorieTargetCardProps) => {
  const [openSettings, setOpenSettings] = useState(false);
  
  // Use default value of 0 if invalid input
  const validCalorieTarget = isNaN(calorieTarget) || calorieTarget <= 0 ? 2000 : Math.round(calorieTarget);
  const validCurrentCalories = isNaN(currentCalories) || currentCalories < 0 ? 0 : Math.round(currentCalories);
  
  // Calculate percentage progress for calories (with validation)
  const caloriePercentage = Math.min(
    Math.round((validCurrentCalories / validCalorieTarget) * 100),
    100
  );
  
  if (isLoading) {
    return (
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full bg-gradient-to-br from-soft-green to-soft-mint p-6 rounded-t-lg">
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
    <Card className="flex-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative w-full bg-gradient-to-br from-soft-green to-soft-mint p-6 rounded-t-lg">
          <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
          <div className="absolute -right-3 -bottom-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">Daily Calorie Target</h3>
              <p className="text-3xl font-bold mt-2 text-primary-darker">{validCalorieTarget.toLocaleString()} kcal</p>
            </div>
            <div className="relative z-10 flex flex-col items-end">
              <div className="bg-white p-3 rounded-full mb-2">
                <Apple className="w-10 h-10 text-primary" />
              </div>
              
              <Dialog open={openSettings} onOpenChange={setOpenSettings}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white shadow-sm"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </DialogTrigger>
                <CalorieSettingsDialog 
                  settings={settings}
                  isPremium={isPremium}
                  onUpdateSetting={onUpdateSetting}
                  onUpdateCustomMacroRatio={onUpdateCustomMacroRatio}
                  onClose={() => setOpenSettings(false)}
                />
              </Dialog>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-primary-dark flex items-center">
                Progress
                <Popover>
                  <PopoverTrigger>
                    <Info className="h-3.5 w-3.5 ml-1 text-primary-light cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-xs p-3 bg-white z-50 shadow-lg">
                    <p>This shows your current progress toward your daily calorie target.</p>
                  </PopoverContent>
                </Popover>
              </span>
              <span className="font-medium text-primary-darker">{caloriePercentage}%</span>
            </div>
            <Progress 
              value={caloriePercentage} 
              className="h-2 bg-primary-lighter" 
              indicatorClassName={cn(
                caloriePercentage > 100 ? "bg-red-500" : "bg-primary"
              )} 
            />
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-b-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Current</span>
            <span className="font-medium">{validCurrentCalories.toLocaleString()} kcal</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Remaining</span>
            <span className={cn(
              "font-medium",
              validCalorieTarget - validCurrentCalories < 0 ? "text-red-500" : "text-primary"
            )}>
              {(validCalorieTarget - validCurrentCalories).toLocaleString()} kcal
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieTargetCard;
