
import { BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MacroRatio } from "@/hooks/useUserNutrition";
import MacroProgress from "./MacroProgress";

interface MacronutrientCardProps {
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  currentMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  macroRatios: MacroRatio;
}

const MacronutrientCard = ({ 
  macros, 
  currentMacros, 
  macroRatios 
}: MacronutrientCardProps) => {
  // Calculate percentage progress for macros
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Macronutrient Targets</h3>
          <BarChart2 className="w-6 h-6 text-indigo-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MacroProgress
            label="Protein"
            color="bg-red-400"
            percentage={proteinPercentage}
            current={currentMacros.protein}
            target={macros.protein}
            ratio={macroRatios.protein}
          />
          
          <MacroProgress
            label="Carbs"
            color="bg-blue-400"
            percentage={carbsPercentage}
            current={currentMacros.carbs}
            target={macros.carbs}
            ratio={macroRatios.carbs}
          />
          
          <MacroProgress
            label="Fats"
            color="bg-yellow-400"
            percentage={fatsPercentage}
            current={currentMacros.fats}
            target={macros.fats}
            ratio={macroRatios.fats}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MacronutrientCard;
