
export type Supermarket = "Tesco" | "Sainsburys" | "Asda" | "Morrisons" | "Waitrose" | "Coop" | "M&S" | "Ocado" | "Aldi" | "All Supermarkets";

export type FoodCategory = 
  | "Dairy & Eggs"
  | "Fruits & Vegetables"
  | "Meat & Fish"
  | "Bread & Bakery"
  | "Drinks"
  | "Snacks"
  | "Ready Meals"
  | "Cereals"
  | "Pasta & Rice"
  | "Condiments"
  | "Frozen Foods"
  | "All Categories";

export type DietaryRestriction =
  | "None"
  | "Vegetarian"
  | "Vegan"
  | "Gluten-Free"
  | "Dairy-Free"
  | "Low-Carb"
  | "Diabetic-Friendly"
  | "Heart-Healthy"
  | "Low-Sodium";

export type MealPlanType =
  | "Low Calorie"
  | "High Protein"
  | "High Carb"
  | "Balanced"
  | "Weight Loss"
  | "Diabetic Friendly"
  | "Heart Healthy"
  | "Coeliac Friendly"
  | "Dairy Free";

export interface ServingSizeOption {
  id: string;
  description: string;
  grams: number;
  is_default: boolean;
}

export type Food = {
  id: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  quantity?: number;
  barcode?: string;
  supermarket: Supermarket;
  category: FoodCategory;
  servingSizeOptions?: ServingSizeOption[];
};

export type NutritionFilters = {
  minCalories: string;
  maxCalories: string;
  minProtein: string;
  maxProtein: string;
  minCarbs: string;
  maxCarbs: string;
  minFat: string;
  maxFat: string;
};

export interface MealPlan {
  id: string;
  type: MealPlanType;
  name: string;
  description: string;
  days: MealPlanDay[];
  dietaryRestrictions: DietaryRestriction[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlanDay {
  day: number;
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
  snacks: Food[];
}
