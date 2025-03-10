
import { FoodSelector } from "@/components/food/FoodSelector";
import React, { memo } from "react";
import { Coffee, UtensilsCrossed, Salad, Cookie } from "lucide-react";

type MealSectionHeaderProps = {
  title: string;
  onFoodSelect: (food: any) => void;
  icon?: React.ReactNode;
};

export const MealSectionHeader = memo(({ title, onFoodSelect, icon }: MealSectionHeaderProps) => {
  // Choose appropriate icon based on meal type if not provided
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    switch (title.toLowerCase()) {
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-blue-500" />;
      case 'lunch':
        return <UtensilsCrossed className="w-4 h-4 text-green-500" />;
      case 'dinner':
        return <Salad className="w-4 h-4 text-purple-500" />;
      case 'snacks':
        return <Cookie className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        {getDefaultIcon()}
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <FoodSelector onFoodSelect={onFoodSelect} />
    </div>
  );
});

MealSectionHeader.displayName = 'MealSectionHeader';
