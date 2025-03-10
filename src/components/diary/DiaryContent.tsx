
import React, { memo, useEffect } from 'react';
import { motion } from "framer-motion";
import { type Meal } from "@/hooks/useSupabase";
import { MealSection } from "@/components/diary/MealSection";
import { ExerciseSection } from "@/components/diary/ExerciseSection";
import { AlertTriangle } from "lucide-react";
import { useHealthIntegration } from "@/hooks/useHealthIntegration";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface DiaryContentProps {
  meals: Record<MealType, Meal[]>;
  onAddFood: (type: MealType) => (food: any) => Promise<void>;
  onDeleteFood: (type: MealType, mealId: string) => Promise<void>;
  onComplete: () => void;
}

export const DiaryContent: React.FC<DiaryContentProps> = memo(({
  meals,
  onAddFood,
  onDeleteFood,
  onComplete
}) => {
  const { syncHealthData, connectedProvider } = useHealthIntegration();
  
  // Sync health data when the diary is loaded
  useEffect(() => {
    if (connectedProvider) {
      syncHealthData().catch(error => {
        console.error('Error syncing health data from diary:', error);
      });
    }
  }, [connectedProvider, syncHealthData]);

  // Ensure meals object is fully populated with all meal types
  const safetyMeals: Record<MealType, Meal[]> = {
    breakfast: Array.isArray(meals.breakfast) ? meals.breakfast : [],
    lunch: Array.isArray(meals.lunch) ? meals.lunch : [],
    dinner: Array.isArray(meals.dinner) ? meals.dinner : [],
    snack: Array.isArray(meals.snack) ? meals.snack : []
  };

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
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <MealSection
            type={type as MealType}
            title={title}
            meals={safetyMeals[type as MealType]}
            onAddFood={onAddFood(type as MealType)}
            onDeleteFood={(mealId) => onDeleteFood(type as MealType, mealId)}
          />
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <ExerciseSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800"
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
});

// Add display name for debugging
DiaryContent.displayName = 'DiaryContent';
