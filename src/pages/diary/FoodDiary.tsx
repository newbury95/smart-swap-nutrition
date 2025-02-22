
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MealSection } from "@/components/diary/MealSection";
import { DailySummary } from "@/components/diary/DailySummary";
import { SponsorBanner } from "@/components/diary/SponsorBanner";
import { Button } from "@/components/ui/button";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";
import { HealthMetrics } from "@/components/diary/HealthMetrics";

type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
};

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const mockSwaps = [
  {
    original: "Fried egg on toast with butter",
    suggestion: "Scrambled egg on dry wholemeal toast",
    reason: "Lower in calories and saturated fats while maintaining protein content. Wholemeal bread provides more fiber and nutrients."
  }
];

const FoodDiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [meals, setMeals] = useState<Record<MealType, Meal[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [showSwaps, setShowSwaps] = useState(false);

  const getTotalNutrients = (mealList: Meal[]) => {
    return mealList.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getAllMealsNutrients = () => {
    const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snack];
    return getTotalNutrients(allMeals);
  };

  const handleAddFood = (type: MealType) => (food: any) => {
    const newMeal: Meal = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
    };

    setMeals(prev => ({
      ...prev,
      [type]: [...prev[type], newMeal]
    }));

    toast({
      title: "Food added",
      description: `${food.name} added to ${type}`,
    });
  };

  const handleDeleteFood = (type: MealType, mealId: string) => {
    setMeals(prev => ({
      ...prev,
      [type]: prev[type].filter(meal => meal.id !== mealId)
    }));

    toast({
      title: "Food removed",
      description: "Item has been removed from your diary",
    });
  };

  const handleComplete = () => {
    setShowSwaps(true);
    toast({
      title: "Daily food diary completed",
      description: "Here are some suggested food swaps based on your goals",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex justify-end mb-4">
              <Button 
                onClick={handleComplete}
                className="w-auto"
              >
                Complete Day
              </Button>
            </div>

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

