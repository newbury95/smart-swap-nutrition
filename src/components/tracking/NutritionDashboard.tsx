
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
  isLoading?: boolean;
}

const NutritionDashboard = ({
  calculations,
  currentCalories,
  currentMacros,
  isLoading = false
}: NutritionDashboardProps) => {
  // Defensive programming: ensure we always have valid values
  const validCalculations = {
    calorieTarget: isNaN(calculations?.calorieTarget) || !calculations?.calorieTarget 
      ? 2000 : calculations.calorieTarget,
    macros: {
      protein: isNaN(calculations?.macros?.protein) || !calculations?.macros?.protein 
        ? 0 : calculations.macros.protein,
      carbs: isNaN(calculations?.macros?.carbs) || !calculations?.macros?.carbs 
        ? 0 : calculations.macros.carbs,
      fats: isNaN(calculations?.macros?.fats) || !calculations?.macros?.fats 
        ? 0 : calculations.macros.fats,
    },
    macroRatios: calculations?.macroRatios || { protein: 25, carbs: 45, fats: 30 },
    bmr: isNaN(calculations?.bmr) || !calculations?.bmr ? 0 : calculations.bmr,
    tdee: isNaN(calculations?.tdee) || !calculations?.tdee ? 0 : calculations.tdee
  };
  
  // Ensure all current values are valid numbers to prevent NaN
  const validCurrentCalories = isNaN(currentCalories) || !currentCalories ? 0 : currentCalories;
  const validCurrentMacros = {
    protein: isNaN(currentMacros?.protein) || !currentMacros?.protein ? 0 : currentMacros.protein,
    carbs: isNaN(currentMacros?.carbs) || !currentMacros?.carbs ? 0 : currentMacros.carbs,
    fats: isNaN(currentMacros?.fats) || !currentMacros?.fats ? 0 : currentMacros.fats
  };
  
  console.log('NutritionDashboard rendering with validated data:', {
    calculations: validCalculations,
    currentCalories: validCurrentCalories, 
    currentMacros: validCurrentMacros,
    isLoading
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
          isLoading={isLoading}
        />

        {/* Energy expenditure card */}
        <EnergyExpenditureCard 
          bmr={validCalculations.bmr} 
          tdee={validCalculations.tdee}
          isLoading={isLoading}
        />
      </div>

      {/* Macronutrients tracking card */}
      <MacronutrientCard 
        macros={validCalculations.macros}
        currentMacros={validCurrentMacros}
        macroRatios={validCalculations.macroRatios}
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default NutritionDashboard;
