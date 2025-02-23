
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, type Meal } from "@/hooks/useSupabase";
import { DiaryContent } from "@/components/diary/DiaryContent";
import { DiarySidebar } from "@/components/diary/DiarySidebar";
import { AdLayout } from "@/components/diary/AdLayout";
import { SponsorBanner } from "@/components/diary/SponsorBanner";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";

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

      <main className="container mx-auto px-4 py-8">
        <AdLayout>
          <DiarySidebar 
            date={date}
            onSelectDate={(newDate) => newDate && setDate(newDate)}
            dailyTotals={getAllMealsNutrients()}
          />
          <DiaryContent
            meals={meals}
            onAddFood={handleAddFood}
            onDeleteFood={handleDeleteFood}
            onComplete={handleComplete}
          />
        </AdLayout>
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
