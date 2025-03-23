
import { Meal } from '../types/supabase';

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealsByType = Record<MealType, Meal[]>;

export type NutrientTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
