
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

export interface MealSectionProps {
  type: MealType;
  title: string;
  meals: Meal[];
  onAddFood: (food: any) => void;
  onDeleteFood: (mealId: string) => void;
}
