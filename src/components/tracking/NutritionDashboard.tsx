
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
  const { calorieTarget, macros, macroRatios, bmr, tdee } = calculations;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Calorie target card */}
        <CalorieTargetCard 
          calorieTarget={calorieTarget} 
          currentCalories={currentCalories} 
        />

        {/* Energy expenditure card */}
        <EnergyExpenditureCard 
          bmr={bmr} 
          tdee={tdee} 
        />
      </div>

      {/* Macronutrients tracking card */}
      <MacronutrientCard 
        macros={macros}
        currentMacros={currentMacros}
        macroRatios={macroRatios}
      />
    </motion.div>
  );
};

export default NutritionDashboard;
