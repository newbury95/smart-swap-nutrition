
export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
