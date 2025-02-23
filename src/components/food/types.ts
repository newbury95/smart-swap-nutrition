
export type Supermarket = "Tesco" | "Sainsburys" | "Asda" | "Morrisons" | "Waitrose" | "Coop" | "M&S" | "Ocado" | "All Supermarkets";

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

export type Food = {
  id: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  barcode?: string;
  supermarket: Supermarket;
  category: FoodCategory;
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

