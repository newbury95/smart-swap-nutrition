
// Types for nutrition calculations
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'weight_loss' | 'maintenance' | 'mass_building';
export type HealthMetricType = 'weight' | 'height' | 'steps' | 'heart-rate' | 'activity';

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

// Goal-specific calorie adjustments
export const goalCalorieAdjustments: Record<FitnessGoal, number> = {
  weight_loss: 0.8, // 20% deficit
  maintenance: 1.0, // No adjustment
  mass_building: 1.15 // 15% surplus
};

/**
 * Calculate BMR using the Mifflin-St Jeor Equation
 */
export const calculateBMR = (weight: number, height: number, age: number, gender: Gender): number => {
  // Ensure inputs are valid numbers
  if (isNaN(weight) || isNaN(height) || isNaN(age) || 
      weight <= 0 || height <= 0 || age <= 0) {
    console.error('Invalid inputs for BMR calculation:', { weight, height, age });
    return 0;
  }

  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    // For non-binary individuals, use an average
    bmr -= 78;
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
 * Calculate calorie target based on TDEE and fitness goal
 */
export const calculateCalorieTarget = (tdee: number, fitnessGoal: FitnessGoal): number => {
  if (isNaN(tdee) || tdee <= 0) {
    console.error('Invalid TDEE for calorie target calculation:', tdee);
    return 2000; // Default to a common target
  }
  
  const adjustment = goalCalorieAdjustments[fitnessGoal] || goalCalorieAdjustments.maintenance;
  
  // Ensure minimum healthy calorie intake (1200 for most adults)
  return Math.max(Math.round(tdee * adjustment), 1200);
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
