
import { Trash2 } from "lucide-react";

type MealItemProps = {
  meal: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    time: string;
  };
  onDelete: (mealId: string) => void;
};

export const MealItem = ({ meal, onDelete }: MealItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
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
          onClick={() => onDelete(meal.id)}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
