
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Utensils, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MealPlan, MealPlanType, DietaryRestriction } from '@/components/food/types';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { mockMealPlans } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MealPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);

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

  const renderMealPlanItem = (item: Food, index: number) => (
    <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
      <div>
        <p className="font-medium">{item.name}</p>
        <div className="text-xs text-gray-500 flex gap-2">
          <span>{item.calories} kcal</span>
          <span>{item.protein}g protein</span>
          <span>{item.carbs}g carbs</span>
          <span>{item.fat}g fat</span>
        </div>
      </div>
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
          <h2 className="text-2xl font-bold mb-6">Choose Your Meal Plan</h2>
          
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
                        const filteredPlans = mockMealPlans.filter(p => p.type === planType.type);
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
                      {day.breakfast.map((item, i) => renderMealPlanItem(item, i))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Lunch</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {day.lunch.map((item, i) => renderMealPlanItem(item, i))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Dinner</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {day.dinner.map((item, i) => renderMealPlanItem(item, i))}
                    </div>
                  </div>
                  
                  {day.snacks.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Snacks</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        {day.snacks.map((item, i) => renderMealPlanItem(item, i))}
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

export default MealPlans;
