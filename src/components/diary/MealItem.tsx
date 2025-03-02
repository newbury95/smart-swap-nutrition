
import { Trash2 } from "lucide-react";
import { type Meal } from "@/hooks/useSupabase";
import { useState } from "react";

type MealItemProps = {
  meal: Meal;
  onDelete: (mealId: string) => void;
};

export const MealItem = ({ meal, onDelete }: MealItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Safely handle missing properties with defaults
  const {
    id = "",
    food_name = "Unknown food",
    protein = 0, 
    carbs = 0, 
    fat = 0,
    calories = 0
  } = meal || {};
  
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!meal) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{food_name}</p>
        <div className="flex gap-3 text-sm text-gray-600">
          <span>{protein}g P</span>
          <span>{carbs}g C</span>
          <span>{fat}g F</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          {calories} kcal
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`text-red-500 hover:text-red-600 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Delete meal"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
