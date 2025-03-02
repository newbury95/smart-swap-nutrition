
import { useToast } from "@/hooks/use-toast";
import { type Meal } from "@/hooks/useSupabase";
import { MealItem } from "./MealItem";
import { MealSectionHeader } from "./MealSectionHeader";
import { MealSectionSummary } from "./MealSectionSummary";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface MealSectionProps {
  type: MealType;
  title: string;
  meals: Meal[];
  onAddFood: (food: any) => void;
  onDeleteFood: (mealId: string) => void;
}

export const MealSection = ({ type, title, meals = [], onAddFood, onDeleteFood }: MealSectionProps) => {
  const { toast } = useToast();
  
  // Ensure meals is always an array, even if it's undefined or null
  const safeMeals = Array.isArray(meals) ? meals : [];
  
  const handleDeleteFood = async (mealId: string) => {
    try {
      await onDeleteFood(mealId);
    } catch (error) {
      console.error(`Error deleting ${type} meal:`, error);
      toast({
        title: "Error",
        description: `Could not delete food item. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  const handleAddFood = async (food: any) => {
    try {
      await onAddFood(food);
    } catch (error) {
      console.error(`Error adding ${type} meal:`, error);
      toast({
        title: "Error",
        description: `Could not add food item. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <MealSectionHeader title={title} onFoodSelect={handleAddFood} />
      
      {safeMeals.length === 0 ? (
        <p className="text-gray-500 text-sm">No foods added yet</p>
      ) : (
        <div className="space-y-3">
          {safeMeals.map((meal) => (
            <MealItem 
              key={meal.id} 
              meal={meal} 
              onDelete={handleDeleteFood}
            />
          ))}
          <MealSectionSummary meals={safeMeals} />
        </div>
      )}
    </div>
  );
};
