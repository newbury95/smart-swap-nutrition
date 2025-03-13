
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
    
    // Validate numeric inputs
    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
      console.warn('Invalid numeric settings for nutrition calculations', settings);
      return;
    }
    
    console.log('Calculating nutrition with settings:', settings);
    
    try {
      // Calculate BMR, TDEE, and calorie target
      const bmr = calculateBMR(weight, height, age, gender);
      
      // Validate BMR
      if (isNaN(bmr) || bmr <= 0) {
        console.error('Invalid BMR calculated:', bmr);
        return;
      }
      
      const tdee = calculateTDEE(bmr, activityLevel);
      
      // Validate TDEE
      if (isNaN(tdee) || tdee <= 0) {
        console.error('Invalid TDEE calculated:', tdee);
        return;
      }
      
      const calorieTarget = calculateCalorieTarget(tdee, fitnessGoal);
      
      // Validate calorie target
      if (isNaN(calorieTarget) || calorieTarget <= 0) {
        console.error('Invalid calorie target calculated:', calorieTarget);
        return;
      }
      
      // Use custom macro ratio if provided (for premium users) or default
      const macroRatios = customMacroRatio || defaultMacroRatios[fitnessGoal];
      
      // Calculate macros in grams
      const macros = calculateMacroGrams(calorieTarget, macroRatios);
      
      // Validate macros
      if (macros.protein < 0 || macros.carbs < 0 || macros.fats < 0) {
        console.error('Invalid macros calculated:', macros);
        return;
      }
      
      const newCalculations = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calorieTarget: Math.round(calorieTarget),
        macros: {
          protein: Math.round(macros.protein),
          carbs: Math.round(macros.carbs),
          fats: Math.round(macros.fats)
        },
        macroRatios,
      };
      
      console.log('New calculations set:', newCalculations);
      
      setCalculations(newCalculations);
    } catch (error) {
      console.error('Error in nutrition calculations:', error);
    }
  }, [settings]);

  return { calculations };
};
