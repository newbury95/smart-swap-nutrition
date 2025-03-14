
export interface NutritionData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export type ChartView = 'calories' | 'macros';
