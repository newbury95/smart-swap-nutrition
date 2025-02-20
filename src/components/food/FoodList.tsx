
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Food } from "./types";

interface FoodListProps {
  foods: Food[];
  onSelect: (food: Food) => void;
}

export const FoodList = ({ foods, onSelect }: FoodListProps) => {
  return (
    <ScrollArea className="h-[500px] rounded-md border p-4">
      <div className="space-y-4">
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => onSelect(food)}
            className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{food.name}</h4>
                <p className="text-sm text-muted-foreground">{food.brand}</p>
                <p className="text-xs text-muted-foreground mt-1">{food.category}</p>
              </div>
              <span className="text-sm font-medium">
                {food.calories} kcal
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <span>P: {food.protein}g</span>
              <span className="mx-2">C: {food.carbs}g</span>
              <span>F: {food.fat}g</span>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
