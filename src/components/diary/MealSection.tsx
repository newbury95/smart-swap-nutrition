
import { motion } from "framer-motion";
import { MealItem } from "./MealItem";
import { MealSectionHeader } from "./MealSectionHeader";
import { MealSectionSummary } from "./MealSectionSummary";
import { useMealSection } from "./hooks/useMealSection";
import type { MealSectionProps } from "./types/meal-section.types";

export const MealSection = ({ type, title, meals, onAddFood, onDeleteFood }: MealSectionProps) => {
  const { toast } = useMealSection();

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
