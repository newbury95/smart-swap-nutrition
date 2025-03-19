
/**
 * Calculate BMI using the standard formula: weight (kg) / (height (m))²
 */
export const calculateBMI = (weight: number, height: number): number => {
  // Handle invalid inputs
  if (!weight || !height || weight <= 0 || height <= 0) {
    return 0;
  }
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI
  return weight / (heightInMeters * heightInMeters);
};

/**
 * Get the BMI category based on the BMI value
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi <= 0) return 'Unknown';
  
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal weight';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

/**
 * Calculate ideal weight range based on BMI range of 18.5-25 (normal weight)
 */
export const calculateIdealWeightRange = (height: number): { min: number; max: number } => {
  if (!height || height <= 0) {
    return { min: 0, max: 0 };
  }
  
  const heightInMeters = height / 100;
  
  return {
    min: Math.round(18.5 * heightInMeters * heightInMeters),
    max: Math.round(25 * heightInMeters * heightInMeters)
  };
};

/**
 * Calculate daily water intake recommendation in liters
 * Based on weight in kg
 */
export const calculateWaterIntake = (weight: number): number => {
  if (!weight || weight <= 0) {
    return 0;
  }
  
  // Recommended water intake: 35ml per kg of body weight
  return Math.round((weight * 35) / 1000 * 10) / 10;
};

/**
 * Calculate calorie burn for various activities
 * Returns calories burned per hour
 */
export const calculateCalorieBurn = (
  weight: number, 
  activity: 'walking' | 'running' | 'cycling' | 'swimming' | 'weight_training'
): number => {
  if (!weight || weight <= 0) {
    return 0;
  }
  
  // MET values (Metabolic Equivalent of Task)
  const metValues = {
    walking: 3.5, // Walking 3mph
    running: 10.0, // Running 6mph
    cycling: 8.0, // Cycling moderate
    swimming: 7.0, // Swimming moderate
    weight_training: 5.0 // Weight training moderate
  };
  
  // Calories burned = MET × weight (kg) × time (hours)
  return Math.round(metValues[activity] * weight);
};

/**
 * Exercise type definition for tracking
 */
export type ExerciseType = 
  | 'cardio'
  | 'weightlifting'
  | 'yoga'
  | 'swimming'
  | 'running'
  | 'cycling'
  | 'other';

/**
 * Estimated calories burned per minute for different exercise types
 */
export const calorieEstimates: Record<ExerciseType, number> = {
  cardio: 8, // ~8 calories per minute
  weightlifting: 5, // ~5 calories per minute
  yoga: 3, // ~3 calories per minute
  swimming: 7, // ~7 calories per minute
  running: 10, // ~10 calories per minute
  cycling: 7, // ~7 calories per minute
  other: 5 // ~5 calories per minute (default)
};
