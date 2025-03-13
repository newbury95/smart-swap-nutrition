
import { useState, useEffect } from 'react';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateCalorieTarget, 
  calculateMacroGrams,
  defaultMacroRatios,
} from '@/utils/nutritionCalculations';
import type { NutritionSettings, NutritionCalculations } from './useUserNutrition';

export const useNutritionCalculator = (settings: NutritionSettings) => {
  const [calculations, setCalculations] = useState<NutritionCalculations>({
    bmr: 0,
    tdee: 0,
    calorieTarget: 0,
    macros: { protein: 0, carbs: 0, fats: 0 },
    macroRatios: defaultMacroRatios.maintenance,
  });

  // Calculate nutrition values whenever settings change
  useEffect(() => {
    const { weight, height, age, gender, activityLevel, fitnessGoal, customMacroRatio } = settings;
    
    // Input validation to prevent calculation errors
    if (!weight || !height || !age || !gender || !activityLevel || !fitnessGoal) {
      console.warn('Missing required settings for nutrition calculations', settings);
      return;
    }
    
    console.log('Calculating nutrition with settings:', settings);
    
    try {
      // Calculate BMR, TDEE, and calorie target
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const calorieTarget = calculateCalorieTarget(tdee, fitnessGoal);
      
      // Use custom macro ratio if provided (for premium users) or default
      const macroRatios = customMacroRatio || defaultMacroRatios[fitnessGoal];
      
      // Calculate macros in grams
      const macros = calculateMacroGrams(calorieTarget, macroRatios);
      
      setCalculations({
        bmr,
        tdee,
        calorieTarget,
        macros,
        macroRatios,
      });
      
      console.log('New calculations set:', {
        bmr,
        tdee,
        calorieTarget,
        macros,
        macroRatios,
      });
    } catch (error) {
      console.error('Error in nutrition calculations:', error);
    }
  }, [settings]);

  return { calculations };
};
