import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodSelector } from "@/components/food/FoodSelector";
import { useToast } from "@/components/ui/use-toast";

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

  const renderMealSection = (type: MealType, title: string) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <FoodSelector onFoodSelect={handleAddFood(type)} />
      </div>
      
      {meals[type].length === 0 ? (
        <p className="text-gray-500 text-sm">No foods added yet</p>
      ) : (
        <div className="space-y-3">
          {meals[type].map((meal) => (
            <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{meal.name}</p>
                <p className="text-sm text-gray-500">{meal.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {meal.calories} kcal
                </div>
                <button
                  onClick={() => handleDeleteFood(type, meal.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total:</span>
              <span>{getTotalNutrients(meals[type]).calories} kcal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const dailyTotals = getAllMealsNutrients();

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
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {renderMealSection("breakfast", "Breakfast")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {renderMealSection("lunch", "Lunch")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {renderMealSection("dinner", "Dinner")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {renderMealSection("snack", "Snacks")}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Sponsor Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Proudly partnered with:</p>
            <div className="flex items-center gap-8">
              {["Gymshark", "Myprotein", "Maxinutrition", "Musclefood"].map((brand) => (
                <motion.a
                  key={brand}
                  href="#"
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {brand}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDiary;
