
import { FoodSelector } from "@/components/food/FoodSelector";

type MealSectionHeaderProps = {
  title: string;
  onFoodSelect: (food: any) => void;
};

export const MealSectionHeader = ({ title, onFoodSelect }: MealSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <FoodSelector onFoodSelect={onFoodSelect} />
    </div>
  );
};
