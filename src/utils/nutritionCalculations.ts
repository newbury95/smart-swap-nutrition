
// Types for nutrition calculations
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'weight_loss' | 'maintenance' | 'mass_building';
export type HealthMetricType = 'weight' | 'height' | 'steps' | 'heart-rate' | 'activity';

// Database type for health metrics
export type DbHealthMetricType = 'weight' | 'height' | 'steps' | 'heart-rate' | 'activity';

export interface MacroRatio {
  protein: number;
  carbs: number;
  fats: number;
}

// Constants for nutritional calculations
export const PROTEIN_CALORIES_PER_GRAM = 4;
export const CARBS_CALORIES_PER_GRAM = 4;
export const FAT_CALORIES_PER_GRAM = 9;

// Activity multipliers for TDEE calculations
export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little to no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  very_active: 1.9 // Intense daily exercise or physical job
};

// Default macro ratios based on fitness goals
export const defaultMacroRatios: Record<FitnessGoal, MacroRatio> = {
  weight_loss: {
    protein: 30,
    carbs: 40,
    fats: 30
  },
  maintenance: {
    protein: 25,
    carbs: 45,
    fats: 30
  },
  mass_building: {
    protein: 30,
    carbs: 50,
    fats: 20
  }
};

// Fixed calorie adjustments for different fitness goals
export const goalCalorieAdjustments: Record<FitnessGoal, number> = {
  weight_loss: -600, // Deficit of 600 calories for weight loss
  maintenance: 0,    // No adjustment for maintenance
  mass_building: 600 // Surplus of 600 calories for mass building
};

/**
 * Calculate BMR using the Mifflin-St Jeor Equation
 * Men: BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years)
 * Women: BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)
 */
export const calculateBMR = (weight: number, height: number, age: number, gender: Gender): number => {
  // Ensure inputs are valid numbers
  if (isNaN(weight) || isNaN(height) || isNaN(age) || 
      weight <= 0 || height <= 0 || age <= 0) {
    console.error('Invalid inputs for BMR calculation:', { weight, height, age });
    return 0;
  }

  // Apply the correct formula based on gender
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    // For non-binary individuals, use an average of the two formulas
    const maleBMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    const femaleBMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    bmr = (maleBMR + femaleBMR) / 2;
  }
  
  // Ensure BMR is always positive
  return Math.max(bmr, 1000);
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  if (isNaN(bmr) || bmr <= 0) {
    console.error('Invalid BMR for TDEE calculation:', bmr);
    return 0;
  }
  
  const multiplier = activityMultipliers[activityLevel] || activityMultipliers.moderate;
  return bmr * multiplier;
};

/**
 * Calculate calorie target based on BMR and fitness goal
 * Uses fixed adjustments (+/- 600 kcal) based on BMR, not TDEE
 */
export const calculateCalorieTarget = (bmr: number, fitnessGoal: FitnessGoal): number => {
  if (isNaN(bmr) || bmr <= 0) {
    console.error('Invalid BMR for calorie target calculation:', bmr);
    return 2000; // Default to a common target
  }
  
  const adjustment = goalCalorieAdjustments[fitnessGoal] || 0;
  
  // Apply the fixed adjustment directly to BMR
  return Math.max(Math.round(bmr + adjustment), 1200);
};

/**
 * Calculate macronutrients in grams based on calorie target and macro ratios
 */
export const calculateMacroGrams = (calorieTarget: number, macroRatios: MacroRatio): MacroRatio => {
  if (isNaN(calorieTarget) || calorieTarget <= 0) {
    console.error('Invalid calorie target for macro calculation:', calorieTarget);
    return { protein: 0, carbs: 0, fats: 0 };
  }
  
  // Calculate calories for each macro
  const proteinCalories = calorieTarget * (macroRatios.protein / 100);
  const carbsCalories = calorieTarget * (macroRatios.carbs / 100);
  const fatsCalories = calorieTarget * (macroRatios.fats / 100);
  
  // Convert calories to grams
  return {
    protein: proteinCalories / PROTEIN_CALORIES_PER_GRAM,
    carbs: carbsCalories / CARBS_CALORIES_PER_GRAM,
    fats: fatsCalories / FAT_CALORIES_PER_GRAM
  };
};
