
import React from 'react';
import { motion } from "framer-motion";
import { type Meal } from "@/hooks/useSupabase";
import { MealSection } from "@/components/diary/MealSection";
import { ExerciseSection } from "@/components/diary/ExerciseSection";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <ExerciseSection />
      </motion.div>
      
      <div className="text-center mt-10">
        <Button onClick={onComplete} className="w-auto">
          Complete Day
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Nutrition Data Disclaimer</p>
            <p>The nutritional information presented here may include both verified and unverified data. 
            Always check the manufacturer's packaging for the most accurate figures. 
            We cannot guarantee the accuracy of all nutritional information.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
