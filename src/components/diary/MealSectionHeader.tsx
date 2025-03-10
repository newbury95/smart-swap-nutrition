
import { FoodSelector } from "@/components/food/FoodSelector";
import React, { memo } from "react";

type MealSectionHeaderProps = {
  title: string;
  onFoodSelect: (food: any) => void;
  icon?: React.ReactNode;
};

export const MealSectionHeader = memo(({ title, onFoodSelect, icon }: MealSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <FoodSelector onFoodSelect={onFoodSelect} />
    </div>
  );
});

MealSectionHeader.displayName = 'MealSectionHeader';
