
import React from 'react';
import { motion } from "framer-motion";
import { type Meal } from "@/hooks/useSupabase";
import { MealSection } from "@/components/diary/MealSection";
import { HealthMetrics } from "@/components/diary/HealthMetrics";
import { Button } from "@/components/ui/button";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface DiaryContentProps {
  meals: Record<MealType, Meal[]>;
  onAddFood: (type: MealType) => (food: any) => Promise<void>;
  onDeleteFood: (type: MealType, mealId: string) => Promise<void>;
  onComplete: () => void;
}

export const DiaryContent: React.FC<DiaryContentProps> = ({
  meals,
  onAddFood,
  onDeleteFood,
  onComplete,
}) => {
  return (
    <div className="space-y-6">
      {[
        { type: "breakfast", title: "Breakfast" },
        { type: "lunch", title: "Lunch" },
        { type: "dinner", title: "Dinner" },
        { type: "snack", title: "Snacks" }
      ].map(({ type, title }, index) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <MealSection
            type={type as MealType}
            title={title}
            meals={meals[type as MealType]}
            onAddFood={onAddFood(type as MealType)}
            onDeleteFood={(mealId) => onDeleteFood(type as MealType, mealId)}
          />
        </motion.div>
      ))}

      <HealthMetrics />
      
      <div className="text-center mt-4">
        <Button onClick={onComplete} className="w-auto">
          Complete Day
        </Button>
      </div>
    </div>
  );
};
