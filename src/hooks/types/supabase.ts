
export type CustomFood = {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  created_at: string;
};

export type HealthMetric = {
  id: string;
  metric_type: 'activity' | 'heart-rate' | 'steps';
  value: number;
  recorded_at: string;
  source: string;
};

export type Meal = {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  serving_size?: string;
  created_at: string;
  date: string;
};

export type FoodSwap = {
  original_food: string;
  suggested_food: string;
  reason: string;
  calorie_difference: number;
  protein_difference: number;
};
