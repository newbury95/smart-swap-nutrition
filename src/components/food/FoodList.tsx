
import { Food } from "./types";
import { Loader2 } from "lucide-react";

interface FoodListProps {
  foods: Food[];
  onSelect: (food: Food) => void;
  isLoading?: boolean;
}

export const FoodList = ({ foods, onSelect, isLoading }: FoodListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No foods found
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {foods.map((food) => (
        <button
          key={food.id}
          onClick={() => onSelect(food)}
          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="font-medium text-gray-900">{food.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            {food.calories} kcal | {food.protein}g P | {food.carbs}g C | {food.fat}g F
          </div>
          {food.servingSize && (
            <div className="text-xs text-gray-400 mt-0.5">
              Per {food.servingSize}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
