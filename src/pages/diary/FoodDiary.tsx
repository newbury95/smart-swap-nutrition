
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MealSection } from "@/components/diary/MealSection";
import { DailySummary } from "@/components/diary/DailySummary";
import { SponsorBanner } from "@/components/diary/SponsorBanner";
import { Button } from "@/components/ui/button";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";
import { HealthMetrics } from "@/components/diary/HealthMetrics";
import { Calendar } from "@/components/ui/calendar";
import { useFoodDiary } from "./hooks/useFoodDiary";
import { MealType } from "./types";

const mockSwaps = [
  {
    original: "Fried egg on toast with butter",
    suggestion: "Scrambled egg on dry wholemeal toast",
    reason: "Lower in calories and saturated fats while maintaining protein content. Wholemeal bread provides more fiber and nutrients."
  }
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
  </div>
);

const FoodDiary = () => {
  const navigate = useNavigate();
  const {
    date,
    setDate,
    meals,
    showSwaps,
    setShowSwaps,
    handleAddFood,
    handleDeleteFood,
    handleComplete,
    getAllMealsNutrients,
    isLoading
  } = useFoodDiary();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </div>

            <DailySummary dailyTotals={getAllMealsNutrients()} />
          </div>

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
                  onAddFood={handleAddFood(type as MealType)}
                  onDeleteFood={(mealId) => handleDeleteFood(type as MealType, mealId)}
                />
              </motion.div>
            ))}

            <HealthMetrics />
            
            <div className="text-center mt-4">
              <Button 
                onClick={handleComplete}
                className="w-auto"
              >
                Complete Day
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SponsorBanner />
      
      {showSwaps && (
        <FoodSwapSuggestions
          swaps={mockSwaps}
          onClose={() => setShowSwaps(false)}
        />
      )}
    </div>
  );
};

export default FoodDiary;
