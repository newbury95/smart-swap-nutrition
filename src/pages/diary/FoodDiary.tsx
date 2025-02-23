import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, type Meal } from "@/hooks/useSupabase";
import { MealSection } from "@/components/diary/MealSection";
import { DailySummary } from "@/components/diary/DailySummary";
import { SponsorBanner } from "@/components/diary/SponsorBanner";
import { Button } from "@/components/ui/button";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";
import { HealthMetrics } from "@/components/diary/HealthMetrics";
import { Calendar } from "@/components/ui/calendar";
import { CriteoAd } from "@/components/diary/CriteoAd";

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
  const { getMeals, addMeal, deleteMeal } = useSupabase();
  const [date, setDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<Record<MealType, Meal[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [showSwaps, setShowSwaps] = useState(false);

  useEffect(() => {
    loadMeals();
  }, [date]);

  const loadMeals = async () => {
    try {
      const fetchedMeals = await getMeals(date);
      const categorizedMeals = fetchedMeals.reduce((acc, meal) => ({
        ...acc,
        [meal.meal_type]: [...(acc[meal.meal_type as MealType] || []), meal]
      }), { breakfast: [], lunch: [], dinner: [], snack: [] } as Record<MealType, Meal[]>);
      
      setMeals(categorizedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meals",
      });
    }
  };

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

  const handleAddFood = (type: MealType) => async (food: any) => {
    try {
      const meal = await addMeal({
        food_name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        meal_type: type,
        serving_size: food.servingSize,
        date: date.toISOString().split('T')[0],
      });

      if (meal) {
        setMeals(prev => ({
          ...prev,
          [type]: [...prev[type], meal]
        }));

        toast({
          title: "Food added",
          description: `${food.name} added to ${type}`,
        });
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food",
      });
    }
  };

  const handleDeleteFood = async (type: MealType, mealId: string) => {
    try {
      await deleteMeal(mealId);
      setMeals(prev => ({
        ...prev,
        [type]: prev[type].filter(meal => meal.id !== mealId)
      }));

      toast({
        title: "Food removed",
        description: "Item has been removed from your diary",
      });
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove food",
      });
    }
  };

  const handleComplete = () => {
    setShowSwaps(true);
    toast({
      title: "Daily food diary completed",
      description: "Here are some suggested food swaps based on your goals",
    });
  };

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

      <div className="container mx-auto px-4 my-4">
        <CriteoAd width={728} height={90} zoneId="YOUR_TOP_ZONE_ID" className="mx-auto" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px,1fr,160px] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
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
              <Button onClick={handleComplete} className="w-auto">
                Complete Day
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <CriteoAd width={160} height={600} zoneId="YOUR_SIDE_ZONE_ID" className="sticky top-4" />
          </div>
        </div>
      </main>

      <div className="container mx-auto px-4 mt-8">
        <CriteoAd width={728} height={90} zoneId="YOUR_BOTTOM_ZONE_ID" className="mx-auto" />
      </div>

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
