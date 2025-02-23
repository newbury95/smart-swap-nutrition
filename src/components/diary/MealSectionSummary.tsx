
import type { Meal } from "./types/meal-section.types";

type MealSectionSummaryProps = {
  meals: Meal[];
};

export const MealSectionSummary = ({ meals }: MealSectionSummaryProps) => {
  const getTotalCalories = (mealList: Meal[]) => {
    return mealList.reduce((acc, meal) => acc + meal.calories, 0);
  };

  return (
    <div className="pt-3 border-t">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Total:</span>
        <span>{getTotalCalories(meals)} kcal</span>
      </div>
    </div>
  );
};
