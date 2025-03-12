
// Utility functions for nutrition and calorie calculations

// Database health metric types (as defined in the database)
export type DbHealthMetricType = 'steps' | 'activity' | 'heart-rate';

// Extended health metric types for application use
export type HealthMetricType = DbHealthMetricType | 
  'weight' | 'height' | 'age' | 'activity_level' | 
  'fitness_goal' | 'gender' | 'custom_protein_ratio' | 
  'custom_carbs_ratio' | 'custom_fats_ratio';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'weight_loss' | 'maintenance' | 'mass_building';
export type Gender = 'male' | 'female' | 'other';

export interface MacroRatio {
  protein: number; // Percentage
  carbs: number;   // Percentage
  fats: number;    // Percentage
}

// Default macro ratios based on fitness goals
export const defaultMacroRatios: Record<FitnessGoal, MacroRatio> = {
  weight_loss: { protein: 30, carbs: 35, fats: 35 },
  maintenance: { protein: 25, carbs: 45, fats: 30 },
  mass_building: { protein: 25, carbs: 55, fats: 20 }
};

// Helper to calculate BMR using the Mifflin-St Jeor Equation
export const calculateBMR = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: Gender
): number => {
  if (weight <= 0 || height <= 0 || age <= 0) {
    console.log('Invalid inputs for BMR calculation:', { weight, height, age });
    return 0;
  }
  
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  
  // Gender adjustment
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    // For non-binary individuals, take average
    bmr -= 78;
  }
  
  console.log('BMR calculated:', bmr, 'with params:', { weight, height, age, gender });
  return Math.round(bmr);
};

// Activity multipliers for TDEE calculation
export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Heavy exercise 6-7 days/week
  very_active: 1.9     // Very heavy exercise, physical job, or training twice a day
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
  console.log('TDEE calculated:', tdee, 'with BMR:', bmr, 'and activity level:', activityLevel);
  return tdee;
};

// Calculate target calories based on goal
export const calculateCalorieTarget = (tdee: number, goal: FitnessGoal): number => {
  let target;
  
  switch (goal) {
    case 'weight_loss':
      target = Math.round(tdee * 0.8); // 20% deficit
      break;
    case 'maintenance':
      target = tdee;
      break;
    case 'mass_building':
      target = Math.round(tdee * 1.15); // 15% surplus
      break;
    default:
      target = tdee;
  }
  
  console.log('Calorie target calculated:', target, 'based on TDEE:', tdee, 'and goal:', goal);
  return target;
};

// Convert calorie target to macronutrient grams
export const calculateMacroGrams = (
  calorieTarget: number, 
  macroRatio: MacroRatio
): { protein: number; carbs: number; fats: number } => {
  // Protein and carbs = 4 calories per gram, fat = 9 calories per gram
  const protein = Math.round((calorieTarget * (macroRatio.protein / 100)) / 4);
  const carbs = Math.round((calorieTarget * (macroRatio.carbs / 100)) / 4);
  const fats = Math.round((calorieTarget * (macroRatio.fats / 100)) / 9);
  
  console.log('Macro grams calculated:', { protein, carbs, fats }, 'based on calorie target:', calorieTarget);
  return { protein, carbs, fats };
};
