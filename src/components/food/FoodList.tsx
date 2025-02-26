
import { useState } from "react";
import { Food } from "./types";
import { Loader2 } from "lucide-react";
import { ServingSizeSelector } from "./ServingSizeSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FoodListProps {
  foods: Food[];
  onSelect: (food: Food) => void;
  isLoading?: boolean;
}

export const FoodList = ({ foods, onSelect, isLoading }: FoodListProps) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedServingSize, setSelectedServingSize] = useState<string>("");

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

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
  };

  const handleConfirm = () => {
    if (selectedFood) {
      onSelect({
        ...selectedFood,
        servingSize: selectedServingSize || selectedFood.servingSize
      });
      setSelectedFood(null);
      setSelectedServingSize("");
    }
  };

  return (
    <>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => handleFoodClick(food)}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="font-medium text-gray-900">{food.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              {food.calories} kcal | {food.protein}g P | {food.carbs}g C | {food.fat}g F
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Per {food.servingSize}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={selectedFood !== null} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedFood?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium">Nutrition per {selectedFood?.servingSize}</div>
                <div className="mt-1 text-gray-500">
                  {selectedFood?.calories} kcal | {selectedFood?.protein}g protein | {selectedFood?.carbs}g carbs | {selectedFood?.fat}g fat
                </div>
              </div>
              {selectedFood && selectedFood.id && (
                <ServingSizeSelector
                  foodId={selectedFood.id}
                  onSelect={setSelectedServingSize}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFood(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Add Food
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
