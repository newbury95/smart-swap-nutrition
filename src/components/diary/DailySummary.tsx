
import React from 'react';

interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailySummaryProps {
  dailyTotals: NutritionSummary;
}

export const DailySummary = ({ dailyTotals }: DailySummaryProps) => {
  const [waterIntake, setWaterIntake] = React.useState(0);

  const handleWaterChange = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Daily Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Calories</span>
          <span className="font-medium">{dailyTotals.calories} kcal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Protein</span>
          <span className="font-medium">{dailyTotals.protein}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Carbs</span>
          <span className="font-medium">{dailyTotals.carbs}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fat</span>
          <span className="font-medium">{dailyTotals.fat}g</span>
        </div>
        <div className="pt-3 border-t">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Water Intake</span>
              <span className="font-medium">{waterIntake}ml</span>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => handleWaterChange(-100)}
                className="flex-1 px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              >
                -100ml
              </button>
              <button
                onClick={() => handleWaterChange(100)}
                className="flex-1 px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                +100ml
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
