
import { MealPlan, Food, MealPlanType, DietaryRestriction, Supermarket } from '@/components/food/types';

// Helper function to create a food item
const createFood = (
  id: string, 
  name: string, 
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  supermarket: Supermarket = "Tesco"
): Food => ({
  id,
  name,
  brand: "",
  calories,
  protein,
  carbs,
  fat,
  servingSize: "100g",
  supermarket,
  category: "All Categories"
});

// Sample foods for meal plans
const foods = {
  // Breakfast items
  oatmeal: createFood("oatmeal", "Oatmeal with Berries", 220, 8, 40, 5),
  eggs: createFood("eggs", "Scrambled Eggs with Spinach", 180, 14, 2, 12),
  smoothie: createFood("smoothie", "Protein Smoothie", 250, 20, 30, 5),
  yogurt: createFood("yogurt", "Greek Yogurt with Honey", 200, 15, 18, 8),
  toast: createFood("toast", "Whole Grain Toast with Avocado", 280, 7, 30, 15),
  
  // Lunch items
  salad: createFood("salad", "Grilled Chicken Salad", 320, 28, 12, 18),
  wrap: createFood("wrap", "Turkey & Veggie Wrap", 380, 25, 40, 12),
  soup: createFood("soup", "Vegetable Soup with Lentils", 250, 15, 35, 6),
  bowl: createFood("bowl", "Quinoa Buddha Bowl", 450, 18, 60, 16),
  
  // Dinner items
  salmon: createFood("salmon", "Baked Salmon with Asparagus", 380, 32, 10, 22),
  chicken: createFood("chicken", "Grilled Chicken with Sweet Potato", 420, 35, 40, 10),
  stir_fry: createFood("stir_fry", "Tofu Vegetable Stir Fry", 350, 20, 35, 15),
  pasta: createFood("pasta", "Whole Wheat Pasta with Turkey Meatballs", 480, 30, 65, 12),
  
  // Snack items
  nuts: createFood("nuts", "Mixed Nuts", 180, 6, 5, 15),
  fruit: createFood("fruit", "Apple with Almond Butter", 150, 4, 18, 8),
  shake: createFood("shake", "Protein Shake", 160, 25, 10, 2),
  bar: createFood("bar", "Protein Bar", 220, 20, 25, 8),
  
  // Aldi protein range
  aldi_yogurt: createFood("aldi_yogurt", "Aldi High Protein Yogurt", 120, 18, 8, 2, "Aldi"),
  aldi_bar: createFood("aldi_bar", "Aldi Protein Bar", 190, 20, 18, 7, "Aldi"),
  aldi_shake: createFood("aldi_shake", "Aldi Protein Shake", 150, 25, 8, 2, "Aldi"),
  aldi_pudding: createFood("aldi_pudding", "Aldi Protein Pudding", 160, 20, 12, 4, "Aldi"),
  
  // Asda protein range
  asda_yogurt: createFood("asda_yogurt", "Asda High Protein Yogurt", 130, 17, 9, 3, "Asda"),
  asda_bar: createFood("asda_bar", "Asda Protein Bar", 200, 22, 15, 8, "Asda"),
  asda_shake: createFood("asda_shake", "Asda Protein Shake", 160, 24, 10, 3, "Asda"),
  asda_pudding: createFood("asda_pudding", "Asda Protein Mousse", 140, 18, 10, 3, "Asda")
};

// Create mock meal plans
export const mockMealPlans: MealPlan[] = [
  {
    id: "low-cal-plan",
    type: "Low Calorie",
    name: "1500 Calorie Plan",
    description: "A balanced meal plan designed for weight management with around 1500 calories per day.",
    dietaryRestrictions: ["None"],
    calories: 1500,
    protein: 110,
    carbs: 160,
    fat: 50,
    days: [
      {
        day: 1,
        breakfast: [foods.oatmeal],
        lunch: [foods.salad],
        dinner: [foods.salmon],
        snacks: [foods.fruit]
      },
      {
        day: 2,
        breakfast: [foods.yogurt],
        lunch: [foods.soup],
        dinner: [foods.chicken],
        snacks: [foods.fruit]
      },
      {
        day: 3,
        breakfast: [foods.toast],
        lunch: [foods.wrap],
        dinner: [foods.stir_fry],
        snacks: [foods.fruit]
      }
    ]
  },
  {
    id: "high-protein-plan",
    type: "High Protein",
    name: "High Protein Plan",
    description: "Protein-focused meal plan with approximately 150g of protein per day for muscle building.",
    dietaryRestrictions: ["None"],
    calories: 2200,
    protein: 180,
    carbs: 180,
    fat: 75,
    days: [
      {
        day: 1,
        breakfast: [foods.eggs, foods.shake],
        lunch: [foods.salad],
        dinner: [foods.chicken],
        snacks: [foods.bar, foods.aldi_bar]
      },
      {
        day: 2,
        breakfast: [foods.smoothie],
        lunch: [foods.wrap],
        dinner: [foods.salmon],
        snacks: [foods.shake, foods.asda_yogurt]
      },
      {
        day: 3,
        breakfast: [foods.yogurt, foods.eggs],
        lunch: [foods.bowl],
        dinner: [foods.pasta],
        snacks: [foods.aldi_pudding, foods.asda_shake]
      }
    ]
  },
  {
    id: "diabetic-plan",
    type: "Diabetic Friendly",
    name: "Diabetic Friendly Plan",
    description: "Balanced meals with controlled carbohydrates to help manage blood sugar levels.",
    dietaryRestrictions: ["Diabetic-Friendly"],
    calories: 1800,
    protein: 120,
    carbs: 140,
    fat: 70,
    days: [
      {
        day: 1,
        breakfast: [foods.eggs],
        lunch: [foods.salad],
        dinner: [foods.salmon],
        snacks: [foods.nuts]
      },
      {
        day: 2,
        breakfast: [foods.yogurt],
        lunch: [foods.soup],
        dinner: [foods.chicken],
        snacks: [foods.fruit]
      },
      {
        day: 3,
        breakfast: [foods.toast],
        lunch: [foods.bowl],
        dinner: [foods.stir_fry],
        snacks: [foods.yogurt]
      }
    ]
  },
  {
    id: "heart-healthy-plan",
    type: "Heart Healthy",
    name: "Heart Healthy Plan",
    description: "Lower sodium and healthy fat options designed to support cardiovascular health.",
    dietaryRestrictions: ["Heart-Healthy", "Low-Sodium"],
    calories: 1900,
    protein: 110,
    carbs: 200,
    fat: 60,
    days: [
      {
        day: 1,
        breakfast: [foods.oatmeal],
        lunch: [foods.soup],
        dinner: [foods.salmon],
        snacks: [foods.fruit]
      },
      {
        day: 2,
        breakfast: [foods.toast],
        lunch: [foods.salad],
        dinner: [foods.stir_fry],
        snacks: [foods.nuts]
      },
      {
        day: 3,
        breakfast: [foods.smoothie],
        lunch: [foods.bowl],
        dinner: [foods.chicken],
        snacks: [foods.yogurt]
      }
    ]
  },
  {
    id: "coeliac-plan",
    type: "Coeliac Friendly",
    name: "Gluten-Free Plan",
    description: "Completely gluten-free meals suitable for those with coeliac disease.",
    dietaryRestrictions: ["Gluten-Free"],
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 70,
    days: [
      {
        day: 1,
        breakfast: [foods.yogurt],
        lunch: [foods.salad],
        dinner: [foods.salmon],
        snacks: [foods.fruit]
      },
      {
        day: 2,
        breakfast: [foods.smoothie],
        lunch: [foods.soup],
        dinner: [foods.stir_fry],
        snacks: [foods.nuts]
      },
      {
        day: 3,
        breakfast: [foods.eggs],
        lunch: [foods.bowl],
        dinner: [foods.chicken],
        snacks: [foods.aldi_pudding]
      }
    ]
  },
  {
    id: "dairy-free-plan",
    type: "Dairy Free",
    name: "Dairy-Free Plan",
    description: "Meal plan with no dairy products, suitable for lactose intolerance or milk allergies.",
    dietaryRestrictions: ["Dairy-Free"],
    calories: 1950,
    protein: 115,
    carbs: 210,
    fat: 65,
    days: [
      {
        day: 1,
        breakfast: [foods.toast],
        lunch: [foods.salad],
        dinner: [foods.salmon],
        snacks: [foods.fruit]
      },
      {
        day: 2,
        breakfast: [foods.smoothie],
        lunch: [foods.wrap],
        dinner: [foods.stir_fry],
        snacks: [foods.nuts]
      },
      {
        day: 3,
        breakfast: [foods.oatmeal],
        lunch: [foods.bowl],
        dinner: [foods.chicken],
        snacks: [foods.bar]
      }
    ]
  },
  {
    id: "high-carb-plan",
    type: "High Carb",
    name: "High Carbohydrate Plan",
    description: "Carbohydrate-focused meals ideal for endurance athletes and high-activity individuals.",
    dietaryRestrictions: ["None"],
    calories: 2400,
    protein: 100,
    carbs: 350,
    fat: 60,
    days: [
      {
        day: 1,
        breakfast: [foods.oatmeal],
        lunch: [foods.pasta],
        dinner: [foods.bowl],
        snacks: [foods.fruit, foods.toast]
      },
      {
        day: 2,
        breakfast: [foods.toast, foods.fruit],
        lunch: [foods.wrap],
        dinner: [foods.pasta],
        snacks: [foods.bar]
      },
      {
        day: 3,
        breakfast: [foods.smoothie],
        lunch: [foods.bowl],
        dinner: [foods.stir_fry],
        snacks: [foods.fruit]
      }
    ]
  }
];
