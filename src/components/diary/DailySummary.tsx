
interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const DailySummary = ({ dailyTotals }: { dailyTotals: NutritionSummary }) => {
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
      </div>
    </div>
  );
};
