
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

export const MealSection = ({ type, title, meals, onAddFood, onDeleteFood }: MealSectionProps) => {
  const { toast } = useToast();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <MealSectionHeader title={title} onFoodSelect={onAddFood} />
      
      {meals.length === 0 ? (
        <p className="text-gray-500 text-sm">No foods added yet</p>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <MealItem 
              key={meal.id} 
              meal={meal} 
              onDelete={onDeleteFood}
            />
          ))}
          <MealSectionSummary meals={meals} />
        </div>
      )}
    </div>
  );
};

