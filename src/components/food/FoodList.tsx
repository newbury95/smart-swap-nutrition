
import { useState } from "react";
import { Food } from "./types";
import { Loader2, Plus, Minus } from "lucide-react";
import { ServingSizeSelector } from "./ServingSizeSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoodListProps {
  foods: Food[];
  onSelect: (food: Food) => void;
  isLoading?: boolean;
}

export const FoodList = ({ foods, onSelect, isLoading }: FoodListProps) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedServingSize, setSelectedServingSize] = useState<string>("");
  const [servingSizeGrams, setServingSizeGrams] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

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
    setQuantity(1);
    setSelectedServingSize("");
    setServingSizeGrams(0);
  };

  const handleServingSizeSelect = (description: string, grams: number) => {
    setSelectedServingSize(description);
    setServingSizeGrams(grams);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleConfirm = () => {
    if (selectedFood && servingSizeGrams > 0) {
      const gramsMultiplier = quantity * (servingSizeGrams / 100);
      
      // Calculate adjusted nutritional values based on serving size and quantity
      const adjustedFood = {
        ...selectedFood,
        servingSize: `${quantity} × ${selectedServingSize}`,
        calories: Math.round(selectedFood.calories * gramsMultiplier),
        protein: Number((selectedFood.protein * gramsMultiplier).toFixed(1)),
        carbs: Number((selectedFood.carbs * gramsMultiplier).toFixed(1)),
        fat: Number((selectedFood.fat * gramsMultiplier).toFixed(1)),
        quantity: quantity
      };

      console.log('Adjusted food:', adjustedFood); // Debug log
      onSelect(adjustedFood);
      setSelectedFood(null);
      setSelectedServingSize("");
      setServingSizeGrams(0);
      setQuantity(1);
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
              {selectedFood && selectedFood.id && (
                <ServingSizeSelector
                  foodId={selectedFood.id}
                  onSelect={handleServingSizeSelect}
                />
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {selectedFood && selectedServingSize && (
                <div className="text-sm mt-4">
                  <div className="font-medium">
                    Nutrition per {quantity} × {selectedServingSize}
                  </div>
                  <div className="mt-1 text-gray-500">
                    {Math.round(selectedFood.calories * quantity * (servingSizeGrams / 100))} kcal | {" "}
                    {(selectedFood.protein * quantity * (servingSizeGrams / 100)).toFixed(1)}g protein | {" "}
                    {(selectedFood.carbs * quantity * (servingSizeGrams / 100)).toFixed(1)}g carbs | {" "}
                    {(selectedFood.fat * quantity * (servingSizeGrams / 100)).toFixed(1)}g fat
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFood(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedServingSize}>
              Add Food
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
