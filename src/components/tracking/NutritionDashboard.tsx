
import { motion } from "framer-motion";
import { NutritionCalculations } from "@/hooks/useUserNutrition";
import CalorieTargetCard from "./dashboard/CalorieTargetCard";
import EnergyExpenditureCard from "./dashboard/EnergyExpenditureCard";
import MacronutrientCard from "./dashboard/MacronutrientCard";

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
  // Add data validation to prevent NaN or undefined values
  const validCalculations = {
    calorieTarget: calculations?.calorieTarget || 2000,
    macros: calculations?.macros || { protein: 0, carbs: 0, fats: 0 },
    macroRatios: calculations?.macroRatios || { protein: 25, carbs: 45, fats: 30 },
    bmr: calculations?.bmr || 0,
    tdee: calculations?.tdee || 0
  };
  
  const validCurrentCalories = isNaN(currentCalories) ? 0 : currentCalories;
  const validCurrentMacros = {
    protein: isNaN(currentMacros?.protein) ? 0 : currentMacros.protein,
    carbs: isNaN(currentMacros?.carbs) ? 0 : currentMacros.carbs,
    fats: isNaN(currentMacros?.fats) ? 0 : currentMacros.fats
  };
  
  console.log('NutritionDashboard rendering with:', {
    calculations: validCalculations,
    currentCalories: validCurrentCalories, 
    currentMacros: validCurrentMacros
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 mt-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calorie target card */}
        <CalorieTargetCard 
          calorieTarget={validCalculations.calorieTarget} 
          currentCalories={validCurrentCalories} 
        />

        {/* Energy expenditure card */}
        <EnergyExpenditureCard 
          bmr={validCalculations.bmr} 
          tdee={validCalculations.tdee} 
        />
      </div>

      {/* Macronutrients tracking card */}
      <MacronutrientCard 
        macros={validCalculations.macros}
        currentMacros={validCurrentMacros}
        macroRatios={validCalculations.macroRatios}
      />
    </motion.div>
  );
};

export default NutritionDashboard;
