
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { FoodSelector } from "@/components/food/FoodSelector";
import { useToast } from "@/hooks/use-toast";

type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
};

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface MealSectionProps {
  type: MealType;
  title: string;
  meals: Meal[];
  onAddFood: (food: any) => void;
  onDeleteFood: (mealId: string) => void;
}

export const MealSection = ({ type, title, meals, onAddFood, onDeleteFood }: MealSectionProps) => {
  const { toast } = useToast();

  const getTotalCalories = (mealList: Meal[]) => {
    return mealList.reduce((acc, meal) => acc + meal.calories, 0);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <FoodSelector onFoodSelect={onAddFood} />
      </div>
      
      {meals.length === 0 ? (
        <p className="text-gray-500 text-sm">No foods added yet</p>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{meal.name}</p>
                <div className="flex gap-3 text-sm text-gray-600">
                  <span>{meal.protein}g P</span>
                  <span>{meal.carbs}g C</span>
                  <span>{meal.fat}g F</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {meal.calories} kcal
                </div>
                <button
                  onClick={() => onDeleteFood(meal.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total:</span>
              <span>{getTotalCalories(meals)} kcal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

