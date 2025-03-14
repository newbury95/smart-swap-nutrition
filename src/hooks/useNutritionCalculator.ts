
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
    if (!settings) {
      console.warn('No settings provided for nutrition calculations');
      return;
    }
    
    const { weight, height, age, gender, activityLevel, fitnessGoal, customMacroRatio } = settings;
    
    // Input validation to prevent calculation errors
    if (!weight || !height || !age || !gender || !activityLevel || !fitnessGoal) {
      console.warn('Missing required settings for nutrition calculations', settings);
      return;
    }
    
    // Validate numeric inputs with more restrictive checks
    if (typeof weight !== 'number' || typeof height !== 'number' || typeof age !== 'number') {
      console.warn('Invalid numeric settings types for nutrition calculations', { weight, height, age });
      return;
    }
    
    if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
      console.warn('Invalid numeric settings values for nutrition calculations', { weight, height, age });
      return;
    }
    
    console.log('Calculating nutrition with validated settings:', {
      weight,
      height,
      age,
      gender,
      activityLevel,
      fitnessGoal
    });
    
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
      
      // Make sure macro ratios add up to 100%
      const totalRatio = macroRatios.protein + macroRatios.carbs + macroRatios.fats;
      const normalizedRatios = totalRatio !== 100 ? {
        protein: Math.round((macroRatios.protein / totalRatio) * 100),
        carbs: Math.round((macroRatios.carbs / totalRatio) * 100),
        fats: Math.round((macroRatios.fats / totalRatio) * 100)
      } : macroRatios;
      
      // Calculate macros in grams
      const macros = calculateMacroGrams(calorieTarget, normalizedRatios);
      
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
        macroRatios: normalizedRatios,
      };
      
      console.log('New nutrition calculations set:', newCalculations);
      
      setCalculations(newCalculations);
    } catch (error) {
      console.error('Error in nutrition calculations:', error);
    }
  }, [settings]);

  return { calculations };
};
