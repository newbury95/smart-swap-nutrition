
import React, { useState } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { mockMealPlans } from '@/utils/mockData';
import { MealPlan } from '@/components/food/types';

// Meal plan categories
const mealPlanTypes = [
  { type: "Low Calorie", color: "bg-blue-100 text-blue-700" },
  { type: "High Protein", color: "bg-green-100 text-green-700" },
  { type: "High Carb", color: "bg-yellow-100 text-yellow-700" },
  { type: "Balanced", color: "bg-purple-100 text-purple-700" },
  { type: "Weight Loss", color: "bg-pink-100 text-pink-700" },
  { type: "Diabetic Friendly", color: "bg-red-100 text-red-700" },
];

// Dietary restrictions
const dietaryRestrictions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Diabetic-Friendly"
];

const MealPlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(mockMealPlans);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);

  const handleRefreshPlans = () => {
    setIsLoading(true);
    
    // Simulate refreshing meal plans with a delay
    setTimeout(() => {
      try {
        // Shuffle meal plans (for demo purposes)
        const shuffled = [...mockMealPlans].sort(() => Math.random() - 0.5);
        setMealPlans(shuffled);
        
        toast({
          title: "Meal Plans Refreshed",
          description: "Your meal plan suggestions have been updated"
        });
      } catch (error) {
        console.error("Error refreshing meal plans:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to refresh meal plans."
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleOpenMealPlan = (mealPlan: MealPlan) => {
    try {
      setSelectedMealPlan(mealPlan);
      setShowMealPlanDetails(true);
    } catch (error) {
      console.error("Error opening meal plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open meal plan details."
      });
    }
  };

  const handleAddToDiary = () => {
    if (selectedMealPlan) {
      toast({
        title: "Meal Plan Added",
        description: `${selectedMealPlan.name} has been added to your food diary`
      });
      setShowMealPlanDetails(false);
    }
  };

  const renderMealPlansByCategory = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mealPlanTypes.map((planType, idx) => (
          <Card 
            key={planType.type}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              const matchingPlan = mealPlans.find(p => p.type === planType.type);
              if (matchingPlan) {
                handleOpenMealPlan(matchingPlan);
              } else {
                toast({
                  variant: "destructive",
                  title: "No Plans Available",
                  description: `No ${planType.type} meal plans available`
                });
              }
            }}
          >
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-full ${planType.color} flex items-center justify-center mb-2`}>
                🍽️
              </div>
              <CardTitle className="text-lg">{planType.type}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <CardDescription>
                {getPlanDescription(planType.type)}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex justify-between items-center">
                <span>View Plan</span>
                <span>→</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderMealPlansByRestriction = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dietaryRestrictions.map((restriction, idx) => (
          <Card 
            key={restriction}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              const matchingPlan = mealPlans.find(p => p.dietaryRestrictions.includes(restriction));
              if (matchingPlan) {
                handleOpenMealPlan(matchingPlan);
              } else {
                toast({
                  variant: "destructive",
                  title: "No Plans Available",
                  description: `No ${restriction} meal plans available`
                });
              }
            }}
          >
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
                <span>→</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/diary')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Diary
          </button>
          <h1 className="text-xl font-semibold text-green-600">Meal Plans</h1>
        </div>
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Choose Your Meal Plan</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshPlans}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Plans
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="category">
              <TabsList className="mb-6">
                <TabsTrigger value="category">By Category</TabsTrigger>
                <TabsTrigger value="restriction">By Dietary Restriction</TabsTrigger>
              </TabsList>
              
              <TabsContent value="category">
                {renderMealPlansByCategory()}
              </TabsContent>
              
              <TabsContent value="restriction">
                {renderMealPlansByRestriction()}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Sheet open={showMealPlanDetails} onOpenChange={setShowMealPlanDetails}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedMealPlan && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>{selectedMealPlan.name}</SheetTitle>
                <SheetDescription>{selectedMealPlan.description}</SheetDescription>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMealPlan.dietaryRestrictions.map(restriction => (
                    <span key={restriction} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {restriction}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-medium text-blue-700">{selectedMealPlan.calories}</div>
                    <div className="text-xs text-blue-600">calories</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-medium text-green-700">{selectedMealPlan.protein}g</div>
                    <div className="text-xs text-green-600">protein</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="font-medium text-yellow-700">{selectedMealPlan.carbs}g</div>
                    <div className="text-xs text-yellow-600">carbs</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="font-medium text-red-700">{selectedMealPlan.fat}g</div>
                    <div className="text-xs text-red-600">fat</div>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2 flex items-center">
                  📅 3-Day Meal Plan
                </h3>
                
                <Tabs defaultValue="day1">
                  <TabsList className="mb-2 w-full">
                    <TabsTrigger value="day1" className="flex-1">Day 1</TabsTrigger>
                    <TabsTrigger value="day2" className="flex-1">Day 2</TabsTrigger>
                    <TabsTrigger value="day3" className="flex-1">Day 3</TabsTrigger>
                  </TabsList>
                  
                  {selectedMealPlan.days.map((day, index) => (
                    <TabsContent key={index} value={`day${day.day}`} className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Breakfast</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.breakfast.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Lunch</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.lunch.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Dinner</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.dinner.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleAddToDiary} className="w-full">
                  Add to My Food Diary
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Helper function to get plan descriptions
const getPlanDescription = (type: string) => {
  switch(type) {
    case "Low Calorie": return "Meals with reduced calories for weight management";
    case "High Protein": return "Protein-focused meals ideal for muscle building";
    case "High Carb": return "Carbohydrate-rich meals perfect for athletes";
    case "Balanced": return "Well-balanced nutrition for overall health";
    case "Weight Loss": return "Structured meal plans designed for weight loss";
    case "Diabetic Friendly": return "Meals suitable for managing blood sugar levels";
    default: return "Customized meal plan";
  }
};

export default MealPlansPage;
