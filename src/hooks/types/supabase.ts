
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
  metric_type: 'activity' | 'heart-rate' | 'steps' | 'weight' | 'height';
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

export type MealPlan = {
  id: string;
  type: string;
  name: string;
  description: string;
  dietary_restrictions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_plan_days?: MealPlanDay[];
};

export type MealPlanDay = {
  id: string;
  day_number: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
};

export type ForumThread = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
};

export type ForumReply = {
  id: string;
  thread_id: string;
  content: string;
  user_id: string;
  created_at: string;
};

export type ForumReport = {
  id: string;
  thread_id: string;
  user_id: string;
  reason: string;
  created_at: string;
};
