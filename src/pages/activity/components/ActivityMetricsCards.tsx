
import { Activity, Calculator, Target } from "lucide-react";

interface ActivityMetricsCardsProps {
  bmr: number;
  tdee: number;
  calorieTarget: number;
}

const ActivityMetricsCards = ({ bmr, tdee, calorieTarget }: ActivityMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-soft-teal rounded-lg flex flex-col items-center justify-center">
        <div className="bg-primary-lighter p-2 rounded-full mb-2">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium mb-1">Current BMR</h2>
        <p className="text-2xl font-bold text-primary">{bmr} kcal</p>
        <p className="text-sm text-gray-500 mt-1">Base Metabolic Rate</p>
      </div>
      
      <div className="p-4 bg-soft-mint rounded-lg flex flex-col items-center justify-center">
        <div className="bg-primary-lighter p-2 rounded-full mb-2">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium mb-1">Daily TDEE</h2>
        <p className="text-2xl font-bold text-primary">{tdee} kcal</p>
        <p className="text-sm text-gray-500 mt-1">Total Daily Energy</p>
      </div>
      
      <div className="p-4 bg-soft-green rounded-lg flex flex-col items-center justify-center">
        <div className="bg-primary-lighter p-2 rounded-full mb-2">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium mb-1">Calorie Target</h2>
        <p className="text-2xl font-bold text-primary">{calorieTarget} kcal</p>
        <p className="text-sm text-gray-500 mt-1">Based on your goal</p>
      </div>
    </div>
  );
};

export default ActivityMetricsCards;
