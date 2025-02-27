
// Utility functions for health and fitness calculations

/**
 * Calculate BMI based on weight in kg and height in cm
 */
export const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export type ExerciseType = 'cardio' | 'weightlifting' | 'yoga' | 'swimming' | 'running' | 'cycling' | 'other';

/**
 * Estimated calories burned per minute by exercise type (for a 70kg person)
 */
export const calorieEstimates: Record<ExerciseType, number> = {
  cardio: 8,
  weightlifting: 5,
  yoga: 3,
  swimming: 10,
  running: 12,
  cycling: 8,
  other: 6
};

/**
 * Get BMI category description
 */
export const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};
