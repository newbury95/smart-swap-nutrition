
// Map nutrition settings keys to health metric types for database storage
export const metricTypeMap: Record<string, string> = {
  age: 'age',
  weight: 'weight',
  height: 'height',
  gender: 'gender',
  activityLevel: 'activity_level',
  fitnessGoal: 'fitness_goal',
  customMacroRatio: 'custom_macro_ratio',
  calorieTarget: 'calorie_target'
};

export type HealthMetricKey = keyof typeof metricTypeMap;
