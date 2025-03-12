
import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { MealPlan, DietaryRestriction, Food, MealPlanType, FoodCategory, Supermarket } from '@/components/food/types';

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
const dietaryRestrictions: DietaryRestriction[] = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Diabetic-Friendly"
];

// Helper function to get description for a plan type
const getPlanDescription = (type: string): string => {
  switch (type) {
    case "Low Calorie":
      return "Reduced calorie plans for weight management";
    case "High Protein":
      return "Protein-focused meals for muscle building";
    case "High Carb":
      return "Carbohydrate-rich plans for energy";
    case "Balanced":
      return "Well-rounded nutrition with balanced macros";
    case "Weight Loss":
      return "Designed specifically for healthy weight loss";
    case "Diabetic Friendly":
      return "Plans suitable for managing blood sugar";
    default:
      return "Customized meal plans for your goals";
  }
};

// Sample meal plan data since we don't have the actual Supabase table
const sampleMealPlans: MealPlan[] = [
  {
    id: "1",
    type: "Low Calorie",
    name: "1500 Calorie Plan",
    description: "A balanced diet with reduced calories",
    dietaryRestrictions: ["None"],
    calories: 1500,
    protein: 100,
    carbs: 150,
    fat: 50,
    days: [
      {
        day: 1,
        breakfast: [
          {
            id: "b1",
            name: "Oatmeal with berries",
            brand: "Generic",
            calories: 300,
            protein: 10,
            carbs: 45,
            fat: 5,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "l1",
            name: "Chicken salad",
            brand: "Homemade",
            calories: 400,
            protein: 35,
            carbs: 20,
            fat: 15,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "d1",
            name: "Grilled fish with vegetables",
            brand: "Homemade",
            calories: 450,
            protein: 35,
            carbs: 25,
            fat: 15,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "s1",
            name: "Greek yogurt",
            brand: "Generic",
            calories: 150,
            protein: 15,
            carbs: 10,
            fat: 5,
            servingSize: "1 cup",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      },
      {
        day: 2,
        breakfast: [
          {
            id: "b2",
            name: "Egg white omelet",
            brand: "Homemade",
            calories: 250,
            protein: 20,
            carbs: 5,
            fat: 10,
            servingSize: "1 omelet",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "l2",
            name: "Tuna sandwich",
            brand: "Homemade",
            calories: 350,
            protein: 30,
            carbs: 30,
            fat: 10,
            servingSize: "1 sandwich",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "d2",
            name: "Turkey meatballs with zucchini noodles",
            brand: "Homemade",
            calories: 400,
            protein: 35,
            carbs: 20,
            fat: 15,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "s2",
            name: "Apple with peanut butter",
            brand: "Generic",
            calories: 200,
            protein: 5,
            carbs: 25,
            fat: 8,
            servingSize: "1 apple, 1 tbsp peanut butter",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      },
      {
        day: 3,
        breakfast: [
          {
            id: "b3",
            name: "Protein smoothie",
            brand: "Homemade",
            calories: 300,
            protein: 25,
            carbs: 30,
            fat: 5,
            servingSize: "1 glass",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "l3",
            name: "Quinoa bowl with vegetables",
            brand: "Homemade",
            calories: 400,
            protein: 15,
            carbs: 60,
            fat: 10,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "d3",
            name: "Grilled chicken with sweet potato",
            brand: "Homemade",
            calories: 450,
            protein: 40,
            carbs: 30,
            fat: 10,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "s3",
            name: "Cottage cheese with berries",
            brand: "Generic",
            calories: 150,
            protein: 15,
            carbs: 10,
            fat: 2,
            servingSize: "1/2 cup",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    type: "High Protein",
    name: "High Protein Plan",
    description: "Protein-focused meals for muscle building",
    dietaryRestrictions: ["None"],
    calories: 2200,
    protein: 180,
    carbs: 180,
    fat: 60,
    days: [
      {
        day: 1,
        breakfast: [
          {
            id: "bp1",
            name: "Protein pancakes",
            brand: "Homemade",
            calories: 400,
            protein: 30,
            carbs: 40,
            fat: 10,
            servingSize: "2 pancakes",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "lp1",
            name: "Chicken breast with quinoa",
            brand: "Homemade",
            calories: 500,
            protein: 45,
            carbs: 40,
            fat: 10,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "dp1",
            name: "Salmon with asparagus",
            brand: "Homemade",
            calories: 550,
            protein: 40,
            carbs: 20,
            fat: 25,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "sp1",
            name: "Protein shake",
            brand: "Generic",
            calories: 250,
            protein: 30,
            carbs: 10,
            fat: 5,
            servingSize: "1 shake",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      },
      {
        day: 2,
        breakfast: [
          {
            id: "bp2",
            name: "Greek yogurt with nuts and berries",
            brand: "Generic",
            calories: 350,
            protein: 25,
            carbs: 20,
            fat: 15,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "lp2",
            name: "Turkey and avocado wrap",
            brand: "Homemade",
            calories: 500,
            protein: 40,
            carbs: 30,
            fat: 20,
            servingSize: "1 wrap",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "dp2",
            name: "Beef stir fry with vegetables",
            brand: "Homemade",
            calories: 600,
            protein: 45,
            carbs: 40,
            fat: 20,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "sp2",
            name: "Cottage cheese with pineapple",
            brand: "Generic",
            calories: 200,
            protein: 20,
            carbs: 15,
            fat: 5,
            servingSize: "1 cup",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      },
      {
        day: 3,
        breakfast: [
          {
            id: "bp3",
            name: "Egg scramble with vegetables",
            brand: "Homemade",
            calories: 400,
            protein: 30,
            carbs: 15,
            fat: 20,
            servingSize: "3 eggs",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "lp3",
            name: "Tuna salad with olive oil",
            brand: "Homemade",
            calories: 450,
            protein: 40,
            carbs: 10,
            fat: 25,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "dp3",
            name: "Chicken thighs with brown rice",
            brand: "Homemade",
            calories: 550,
            protein: 40,
            carbs: 50,
            fat: 15,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "sp3",
            name: "Protein bar",
            brand: "Generic",
            calories: 250,
            protein: 20,
            carbs: 25,
            fat: 8,
            servingSize: "1 bar",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    type: "Balanced",
    name: "Vegetarian Plan",
    description: "Plant-based nutrition without meat",
    dietaryRestrictions: ["Vegetarian"],
    calories: 1800,
    protein: 80,
    carbs: 220,
    fat: 60,
    days: [
      {
        day: 1,
        breakfast: [
          {
            id: "bv1",
            name: "Overnight oats with almond milk",
            brand: "Homemade",
            calories: 350,
            protein: 12,
            carbs: 60,
            fat: 8,
            servingSize: "1 jar",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "lv1",
            name: "Lentil soup with whole grain bread",
            brand: "Homemade",
            calories: 450,
            protein: 20,
            carbs: 70,
            fat: 10,
            servingSize: "1 bowl, 1 slice",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "dv1",
            name: "Vegetable stir fry with tofu",
            brand: "Homemade",
            calories: 400,
            protein: 25,
            carbs: 40,
            fat: 15,
            servingSize: "1 plate",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "sv1",
            name: "Hummus with carrot sticks",
            brand: "Homemade",
            calories: 200,
            protein: 8,
            carbs: 20,
            fat: 10,
            servingSize: "1/4 cup hummus, 1 cup carrots",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      },
      {
        day: 2,
        breakfast: [
          {
            id: "bv2",
            name: "Smoothie bowl with fruits and seeds",
            brand: "Homemade",
            calories: 380,
            protein: 15,
            carbs: 65,
            fat: 8,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "lv2",
            name: "Quinoa salad with chickpeas",
            brand: "Homemade",
            calories: 420,
            protein: 18,
            carbs: 65,
            fat: 12,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "dv2",
            name: "Bean and vegetable chili",
            brand: "Homemade",
            calories: 450,
            protein: 22,
            carbs: 60,
            fat: 15,
            servingSize: "1 bowl",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "sv2",
            name: "Mixed nuts and dried fruits",
            brand: "Generic",
            calories: 250,
            protein: 8,
            carbs: 25,
            fat: 15,
            servingSize: "1/4 cup",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      },
      {
        day: 3,
        breakfast: [
          {
            id: "bv3",
            name: "Yogurt parfait with granola",
            brand: "Homemade",
            calories: 320,
            protein: 15,
            carbs: 45,
            fat: 10,
            servingSize: "1 parfait",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        lunch: [
          {
            id: "lv3",
            name: "Vegetable wrap with avocado",
            brand: "Homemade",
            calories: 400,
            protein: 12,
            carbs: 50,
            fat: 20,
            servingSize: "1 wrap",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        dinner: [
          {
            id: "dv3",
            name: "Eggplant parmesan with salad",
            brand: "Homemade",
            calories: 500,
            protein: 20,
            carbs: 40,
            fat: 25,
            servingSize: "1 portion",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ],
        snacks: [
          {
            id: "sv3",
            name: "Edamame",
            brand: "Generic",
            calories: 150,
            protein: 12,
            carbs: 10,
            fat: 5,
            servingSize: "1 cup",
            supermarket: "All Supermarkets",
            category: "All Categories"
          }
        ]
      }
    ]
  }
];

const MealPlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

  useEffect(() => {
    const loadMealPlans = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setMealPlans(sampleMealPlans);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading meal plans:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load meal plans."
        });
        setIsLoading(false);
      }
    };

    loadMealPlans();
  }, [toast]);

  const transformFoodItem = (foodData: any): Food => {
    return {
      id: foodData.id,
      name: foodData.name,
      brand: foodData.brand || "",
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      servingSize: foodData.serving_size || "100g",
      supermarket: foodData.supermarket || "All Supermarkets",
      category: foodData.category || "All Categories"
    };
  };

  const handleRefreshPlans = async () => {
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        setMealPlans(sampleMealPlans);
        setIsLoading(false);
        
        toast({
          title: "Meal Plans Refreshed",
          description: "Your meal plan suggestions have been updated"
        });
      }, 1000);
    } catch (error) {
      console.error("Error refreshing meal plans:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh meal plans."
      });
      setIsLoading(false);
    }
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

  const handleAddFoodToDiary = (food: Food) => {
    toast({
      title: "Food Added",
      description: `${food.name} has been added to your food diary`
    });
  };

  const handleAddToDiary = () => {
    if (selectedFoods.length > 0) {
      toast({
        title: "Foods Added",
        description: `${selectedFoods.length} items have been added to your food diary`
      });
      setSelectedFoods([]);
      setShowMealPlanDetails(false);
    } else if (selectedMealPlan) {
      toast({
        title: "Meal Plan Added",
        description: `${selectedMealPlan.name} has been added to your food diary`
      });
      setShowMealPlanDetails(false);
    }
  };

  const toggleFoodSelection = (food: Food) => {
    setSelectedFoods(prev => {
      const exists = prev.some(f => f.id === food.id);
      return exists 
        ? prev.filter(f => f.id !== food.id) 
        : [...prev, food];
    });
  };

  const renderMealPlansByCategory = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mealPlanTypes.map((planType) => (
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
        {dietaryRestrictions.map((restriction) => (
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
          ) : mealPlans.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900">No Meal Plans Available</h3>
              <p className="mt-2 text-gray-500">We don't have any meal plans available right now. Please check back later.</p>
              <Button 
                onClick={handleRefreshPlans} 
                className="mt-4"
                disabled={isLoading}
              >
                Try Again
              </Button>
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
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Breakfast - Option 1</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.breakfast.slice(0, Math.ceil(day.breakfast.length/2)).map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddFoodToDiary(item);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {day.breakfast.length > 1 && (
                          <>
                            <h4 className="font-medium text-sm text-gray-600 mb-1 mt-3">Breakfast - Option 2</h4>
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                              {day.breakfast.slice(Math.ceil(day.breakfast.length/2)).map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <div className="text-xs text-gray-500 flex gap-2">
                                      <span>{item.calories} kcal</span>
                                      <span>{item.protein}g protein</span>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddFoodToDiary(item);
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Lunch - Option 1</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.lunch.slice(0, Math.ceil(day.lunch.length/2)).map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddFoodToDiary(item);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {day.lunch.length > 1 && (
                          <>
                            <h4 className="font-medium text-sm text-gray-600 mb-1 mt-3">Lunch - Option 2</h4>
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                              {day.lunch.slice(Math.ceil(day.lunch.length/2)).map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <div className="text-xs text-gray-500 flex gap-2">
                                      <span>{item.calories} kcal</span>
                                      <span>{item.protein}g protein</span>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddFoodToDiary(item);
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Dinner - Option 1</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.dinner.slice(0, Math.ceil(day.dinner.length/2)).map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddFoodToDiary(item);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {day.dinner.length > 1 && (
                          <>
                            <h4 className="font-medium text-sm text-gray-600 mb-1 mt-3">Dinner - Option 2</h4>
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                              {day.dinner.slice(Math.ceil(day.dinner.length/2)).map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <div className="text-xs text-gray-500 flex gap-2">
                                      <span>{item.calories} kcal</span>
                                      <span>{item.protein}g protein</span>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddFoodToDiary(item);
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Snacks</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          {day.snacks.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500 flex gap-2">
                                  <span>{item.calories} kcal</span>
                                  <span>{item.protein}g protein</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddFoodToDiary(item);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <Button 
                  className="w-full"
                  onClick={handleAddToDiary}
                >
                  {selectedFoods.length > 0 
                    ? `Add ${selectedFoods.length} selected foods to diary` 
                    : "Add entire meal plan to diary"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MealPlansPage;
