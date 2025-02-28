
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Utensils, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MealPlan, MealPlanType, DietaryRestriction, Food } from '@/components/food/types';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { mockMealPlans } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMealManagement } from '@/hooks/useMealManagement';

const MealPlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);
  const [shuffledMeals, setShuffledMeals] = useState<MealPlan[]>([]);
  const today = new Date();
  const { handleAddFood } = useMealManagement(today);

  // Initialize with shuffled meal plans
  useEffect(() => {
    regenerateMealPlans();
  }, []);

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Regenerate meal plans with random meals
  const regenerateMealPlans = () => {
    const shuffled = mockMealPlans.map(plan => {
      // Create a deep copy of the plan
      const newPlan = { ...plan };
      
      // Shuffle days for each plan to create variation
      newPlan.days = plan.days.map(day => {
        // For each day, shuffle the breakfast, lunch, dinner, and snacks arrays
        return {
          ...day,
          breakfast: shuffleArray([...day.breakfast]),
          lunch: shuffleArray([...day.lunch]),
          dinner: shuffleArray([...day.dinner]),
          snacks: shuffleArray([...day.snacks]),
        };
      });
      
      // Recalculate the nutritional totals based on the new meal combinations
      const allFoods = newPlan.days.flatMap(day => [
        ...day.breakfast, 
        ...day.lunch, 
        ...day.dinner, 
        ...day.snacks
      ]);
      
      // Calculate the average nutritional values across all days
      newPlan.calories = Math.round(allFoods.reduce((sum, food) => sum + food.calories, 0) / newPlan.days.length);
      newPlan.protein = Math.round(allFoods.reduce((sum, food) => sum + food.protein, 0) / newPlan.days.length);
      newPlan.carbs = Math.round(allFoods.reduce((sum, food) => sum + food.carbs, 0) / newPlan.days.length);
      newPlan.fat = Math.round(allFoods.reduce((sum, food) => sum + food.fat, 0) / newPlan.days.length);
      
      return newPlan;
    });
    
    setShuffledMeals(shuffled);
  };

  const handleOpenMealPlan = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowMealPlanDetails(true);
  };

  const handleAddToDiary = () => {
    if (selectedMealPlan) {
      toast({
        title: "Meal plan added to diary",
        description: `${selectedMealPlan.name} has been added to your food diary`,
      });
      setShowMealPlanDetails(false);
      navigate('/diary');
    }
  };

  const handleAddSingleMeal = (meal: Food, mealType: string) => {
    let mealTypeForDiary: "breakfast" | "lunch" | "dinner" | "snack" = "snack";
    
    switch(mealType.toLowerCase()) {
      case "breakfast":
        mealTypeForDiary = "breakfast";
        break;
      case "lunch":
        mealTypeForDiary = "lunch";
        break;
      case "dinner":
        mealTypeForDiary = "dinner";
        break;
      default:
        mealTypeForDiary = "snack";
    }
    
    handleAddFood(mealTypeForDiary)({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      servingSize: meal.servingSize,
    });
    
    toast({
      title: "Meal added to diary",
      description: `${meal.name} has been added to your ${mealTypeForDiary}`,
    });
  };

  const mealPlanTypes: { type: MealPlanType; icon: React.ReactNode; color: string }[] = [
    { type: "Low Calorie", icon: <Utensils className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
    { type: "High Protein", icon: <Utensils className="h-5 w-5" />, color: "bg-green-100 text-green-700" },
    { type: "High Carb", icon: <Utensils className="h-5 w-5" />, color: "bg-yellow-100 text-yellow-700" },
    { type: "Balanced", icon: <Utensils className="h-5 w-5" />, color: "bg-purple-100 text-purple-700" },
    { type: "Weight Loss", icon: <Utensils className="h-5 w-5" />, color: "bg-pink-100 text-pink-700" },
    { type: "Diabetic Friendly", icon: <Utensils className="h-5 w-5" />, color: "bg-red-100 text-red-700" },
    { type: "Heart Healthy", icon: <Utensils className="h-5 w-5" />, color: "bg-orange-100 text-orange-700" },
    { type: "Coeliac Friendly", icon: <Utensils className="h-5 w-5" />, color: "bg-teal-100 text-teal-700" },
    { type: "Dairy Free", icon: <Utensils className="h-5 w-5" />, color: "bg-indigo-100 text-indigo-700" },
  ];

  const renderMealPlanItem = (item: Food, index: number, mealType: string) => (
    <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <div className="text-xs text-gray-500 flex gap-2">
          <span>{item.calories} kcal</span>
          <span>{item.protein}g protein</span>
          <span>{item.carbs}g carbs</span>
          <span>{item.fat}g fat</span>
        </div>
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 p-0" 
        onClick={() => handleAddSingleMeal(item, mealType)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-green-600">Meal Plans</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Choose Your Meal Plan</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={regenerateMealPlans}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Plans
            </Button>
          </div>
          
          <Tabs defaultValue="category">
            <TabsList className="mb-6">
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="restriction">By Dietary Restriction</TabsTrigger>
            </TabsList>
            
            <TabsContent value="category">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {mealPlanTypes.map((planType, idx) => (
                  <motion.div
                    key={planType.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        const filteredPlans = shuffledMeals.filter(p => p.type === planType.type);
                        if (filteredPlans.length > 0) {
                          handleOpenMealPlan(filteredPlans[0]);
                        }
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className={`w-10 h-10 rounded-full ${planType.color} flex items-center justify-center mb-2`}>
                          {planType.icon}
                        </div>
                        <CardTitle className="text-lg">{planType.type}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <CardDescription>
                          {planType.type === "Low Calorie" && "Meals with reduced calories for weight management"}
                          {planType.type === "High Protein" && "Protein-focused meals ideal for muscle building"}
                          {planType.type === "High Carb" && "Carbohydrate-rich meals perfect for athletes"}
                          {planType.type === "Balanced" && "Well-balanced nutrition for overall health"}
                          {planType.type === "Weight Loss" && "Structured meal plans designed for weight loss"}
                          {planType.type === "Diabetic Friendly" && "Meals suitable for managing blood sugar levels"}
                          {planType.type === "Heart Healthy" && "Low sodium, low fat meals for cardiovascular health"}
                          {planType.type === "Coeliac Friendly" && "Gluten-free options for those with coeliac disease"}
                          {planType.type === "Dairy Free" && "Meals without dairy products for those with lactose intolerance"}
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full flex justify-between items-center">
                          <span>View Plan</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="restriction">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Diabetic-Friendly"].map((restriction, idx) => (
                  <motion.div
                    key={restriction}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{restriction}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Meal plans suitable for {restriction.toLowerCase()} diets
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full flex justify-between items-center">
                          <span>View Plans</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Meal Plan Details Sheet */}
      <Sheet open={showMealPlanDetails} onOpenChange={setShowMealPlanDetails}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>{selectedMealPlan?.name}</SheetTitle>
            <SheetDescription>{selectedMealPlan?.description}</SheetDescription>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMealPlan?.dietaryRestrictions.map(restriction => (
                <span key={restriction} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {restriction}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-medium text-blue-700">{selectedMealPlan?.calories}</div>
                <div className="text-xs text-blue-600">calories</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-medium text-green-700">{selectedMealPlan?.protein}g</div>
                <div className="text-xs text-green-600">protein</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="font-medium text-yellow-700">{selectedMealPlan?.carbs}g</div>
                <div className="text-xs text-yellow-600">carbs</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="font-medium text-red-700">{selectedMealPlan?.fat}g</div>
                <div className="text-xs text-red-600">fat</div>
              </div>
            </div>
          </SheetHeader>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              3-Day Meal Plan
            </h3>
            
            <Tabs defaultValue="day1">
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="day1" className="flex-1">Day 1</TabsTrigger>
                <TabsTrigger value="day2" className="flex-1">Day 2</TabsTrigger>
                <TabsTrigger value="day3" className="flex-1">Day 3</TabsTrigger>
              </TabsList>
              
              {selectedMealPlan?.days.map((day, index) => (
                <TabsContent key={index} value={`day${day.day}`} className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Breakfast</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {day.breakfast.map((item, i) => renderMealPlanItem(item, i, "breakfast"))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Lunch</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {day.lunch.map((item, i) => renderMealPlanItem(item, i, "lunch"))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Dinner</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {day.dinner.map((item, i) => renderMealPlanItem(item, i, "dinner"))}
                    </div>
                  </div>
                  
                  {day.snacks.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Snacks</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        {day.snacks.map((item, i) => renderMealPlanItem(item, i, "snack"))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="mt-6">
            <Button onClick={handleAddToDiary} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add to My Food Diary
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MealPlansPage;
