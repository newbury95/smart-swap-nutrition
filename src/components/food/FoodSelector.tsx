import { useState, useEffect } from "react";
import { Search, Barcode, Plus, X, Filter } from "lucide-react";
import { BrowserMultiFormatReader } from '@zxing/library';
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";
import { CustomFoodForm } from "./CustomFoodForm";

type Supermarket = "Tesco" | "Sainsburys" | "Asda" | "Morrisons" | "Waitrose" | "Coop" | "M&S" | "Ocado" | "All Supermarkets";

type FoodCategory = 
  | "Dairy & Eggs"
  | "Fruits & Vegetables"
  | "Meat & Fish"
  | "Bread & Bakery"
  | "Drinks"
  | "Snacks"
  | "Ready Meals"
  | "Cereals"
  | "Pasta & Rice"
  | "Condiments"
  | "Frozen Foods"
  | "All Categories";

type Food = {
  id: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  barcode?: string;
  supermarket: Supermarket;
  category: FoodCategory;
};

interface FoodSelectorProps {
  onFoodSelect: (food: Food) => void;
}

const mockFoods: Food[] = [
  {
    id: "1",
    name: "Semi Skimmed Milk",
    brand: "Tesco",
    calories: 50,
    protein: 3.6,
    carbs: 4.8,
    fat: 1.8,
    servingSize: "100ml",
    barcode: "5000436889195",
    supermarket: "Tesco",
    category: "Dairy & Eggs"
  },
  {
    id: "2",
    name: "Greek Style Natural Yogurt",
    brand: "Sainsburys",
    calories: 133,
    protein: 5.2,
    carbs: 4.7,
    fat: 10.2,
    servingSize: "100g",
    barcode: "7874236589120",
    supermarket: "Sainsburys",
    category: "Dairy & Eggs"
  },
  {
    id: "3",
    name: "Large Free Range Eggs",
    brand: "Asda",
    calories: 72,
    protein: 6.5,
    carbs: 0,
    fat: 5.1,
    servingSize: "1 egg (58g)",
    barcode: "5051413584726",
    supermarket: "Asda",
    category: "Dairy & Eggs"
  },
  {
    id: "4",
    name: "Organic Bananas",
    brand: "Waitrose",
    calories: 95,
    protein: 1.2,
    carbs: 22,
    fat: 0.3,
    servingSize: "1 banana (118g)",
    barcode: "0000000000000",
    supermarket: "Waitrose",
    category: "Fruits & Vegetables"
  },
  {
    id: "5",
    name: "Pink Lady Apples",
    brand: "M&S",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    servingSize: "1 apple (100g)",
    supermarket: "M&S",
    category: "Fruits & Vegetables"
  },
  {
    id: "6",
    name: "Chicken Breast Fillets",
    brand: "Tesco",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: "100g",
    supermarket: "Tesco",
    category: "Meat & Fish"
  },
  {
    id: "7",
    name: "Scottish Salmon Fillet",
    brand: "Sainsburys",
    calories: 208,
    protein: 20.4,
    carbs: 0,
    fat: 13.8,
    servingSize: "100g",
    supermarket: "Sainsburys",
    category: "Meat & Fish"
  },
  {
    id: "8",
    name: "Wholemeal Bread",
    brand: "Hovis",
    calories: 93,
    protein: 4.1,
    carbs: 15.6,
    fat: 1.2,
    servingSize: "1 slice (40g)",
    supermarket: "Tesco",
    category: "Bread & Bakery"
  },
  {
    id: "9",
    name: "Coca Cola Original",
    brand: "Coca Cola",
    calories: 42,
    protein: 0,
    carbs: 10.6,
    fat: 0,
    servingSize: "100ml",
    supermarket: "All Supermarkets",
    category: "Drinks"
  },
  {
    id: "10",
    name: "Orange Juice Smooth",
    brand: "Tropicana",
    calories: 42,
    protein: 0.5,
    carbs: 9.1,
    fat: 0,
    servingSize: "100ml",
    supermarket: "All Supermarkets",
    category: "Drinks"
  },
  {
    id: "11",
    name: "Lightly Salted Crisps",
    brand: "Walkers",
    calories: 526,
    protein: 6.1,
    carbs: 51,
    fat: 32,
    servingSize: "100g",
    supermarket: "All Supermarkets",
    category: "Snacks"
  },
  {
    id: "12",
    name: "Dark Chocolate 70%",
    brand: "Lindt Excellence",
    calories: 545,
    protein: 7.5,
    carbs: 45,
    fat: 37.5,
    servingSize: "100g",
    supermarket: "All Supermarkets",
    category: "Snacks"
  },
  {
    id: "13",
    name: "Chicken Tikka Masala & Rice",
    brand: "Sainsburys",
    calories: 440,
    protein: 23,
    carbs: 55,
    fat: 14,
    servingSize: "400g",
    supermarket: "Sainsburys",
    category: "Ready Meals"
  },
  {
    id: "14",
    name: "Porridge Oats",
    brand: "Quaker",
    calories: 372,
    protein: 11.4,
    carbs: 60,
    fat: 8,
    servingSize: "100g",
    supermarket: "All Supermarkets",
    category: "Cereals"
  },
  {
    id: "15",
    name: "Wholewheat Spaghetti",
    brand: "Tesco",
    calories: 348,
    protein: 12,
    carbs: 68,
    fat: 2.2,
    servingSize: "100g dry",
    supermarket: "Tesco",
    category: "Pasta & Rice"
  },
  {
    id: "16",
    name: "Basmati Rice",
    brand: "Tilda",
    calories: 350,
    protein: 8.6,
    carbs: 77.6,
    fat: 1.3,
    servingSize: "100g dry",
    supermarket: "All Supermarkets",
    category: "Pasta & Rice"
  },
  {
    id: "17",
    name: "Mayonnaise",
    brand: "Hellmann's",
    calories: 721,
    protein: 1.1,
    carbs: 1.3,
    fat: 79,
    servingSize: "100g",
    supermarket: "All Supermarkets",
    category: "Condiments"
  },
  {
    id: "18",
    name: "Garden Peas",
    brand: "Birds Eye",
    calories: 68,
    protein: 5.2,
    carbs: 9.1,
    fat: 0.4,
    servingSize: "100g",
    supermarket: "All Supermarkets",
    category: "Pasta & Rice"
  },
  {
    id: "19",
    name: "Baby Spinach",
    brand: "M&S",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: "100g",
    supermarket: "M&S",
    category: "Fruits & Vegetables"
  },
  {
    id: "20",
    name: "Cherry Tomatoes",
    brand: "Waitrose",
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    servingSize: "100g",
    supermarket: "Waitrose",
    category: "Fruits & Vegetables"
  }
];

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const { toast } = useToast();
  const { isPremium, customFoods, loading: supabaseLoading } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>("All Categories");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("database");
  const [nutritionFilters, setNutritionFilters] = useState({
    minCalories: "",
    maxCalories: "",
    minProtein: "",
    maxProtein: "",
    minCarbs: "",
    maxCarbs: "",
    minFat: "",
    maxFat: "",
  });
  
  const filteredFoods = mockFoods.filter(food => {
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupermarket = selectedSupermarket === "all" || food.supermarket === selectedSupermarket;
    const matchesCategory = selectedCategory === "All Categories" || food.category === selectedCategory;
    const matchesNutrition = 
      (!nutritionFilters.minCalories || food.calories >= Number(nutritionFilters.minCalories)) &&
      (!nutritionFilters.maxCalories || food.calories <= Number(nutritionFilters.maxCalories)) &&
      (!nutritionFilters.minProtein || food.protein >= Number(nutritionFilters.minProtein)) &&
      (!nutritionFilters.maxProtein || food.protein <= Number(nutritionFilters.maxProtein)) &&
      (!nutritionFilters.minCarbs || food.carbs >= Number(nutritionFilters.minCarbs)) &&
      (!nutritionFilters.maxCarbs || food.carbs <= Number(nutritionFilters.maxCarbs)) &&
      (!nutritionFilters.minFat || food.fat >= Number(nutritionFilters.minFat)) &&
      (!nutritionFilters.maxFat || food.fat <= Number(nutritionFilters.maxFat));

    return matchesSearch && matchesSupermarket && matchesCategory && matchesNutrition;
  });

  const filteredCustomFoods = customFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBarcodeScanner = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();

    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast({
          variant: "destructive",
          title: "No camera found",
          description: "Please ensure you have a camera connected and have granted permission.",
        });
        return;
      }

      const previewEl = document.createElement('video');
      previewEl.className = 'w-full h-64 object-cover rounded-lg';
      const previewContainer = document.getElementById('barcode-scanner-preview');
      if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.appendChild(previewEl);
      }

      const result = await codeReader.decodeOnceFromConstraints(
        { video: { facingMode: 'environment' } },
        previewEl
      );

      const foodItem = mockFoods.find(food => food.barcode === result.getText());
      
      if (foodItem) {
        onFoodSelect(foodItem);
        toast({
          title: "Food found!",
          description: `Added ${foodItem.name} to your diary.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Food not found",
          description: "This barcode isn't in our database yet.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning failed",
        description: "Please try again or search manually.",
      });
    } finally {
      setIsScanning(false);
      codeReader.reset();
    }
  };

  const handleCustomFoodSelect = (customFood: any) => {
    const food: Food = {
      id: customFood.id,
      name: customFood.name,
      brand: customFood.brand || "",
      calories: customFood.calories,
      protein: customFood.protein,
      carbs: customFood.carbs,
      fat: customFood.fat,
      servingSize: customFood.serving_size,
      supermarket: "Tesco",
      category: "Dairy & Eggs"
    };
    onFoodSelect(food);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add Food</SheetTitle>
        </SheetHeader>
        
        <div className="my-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="custom" disabled={!isPremium}>
                {isPremium ? "Custom Foods" : "Premium Only"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="database" className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBarcodeScanner}
                  disabled={isScanning}
                >
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>

              {showFilters && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="w-full p-2 rounded-md border border-gray-300"
                      value={selectedSupermarket}
                      onChange={(e) => setSelectedSupermarket(e.target.value as Supermarket | "all")}
                    >
                      <option value="all">All Supermarkets</option>
                      <option value="Tesco">Tesco</option>
                      <option value="Sainsburys">Sainsbury's</option>
                      <option value="Asda">Asda</option>
                      <option value="Morrisons">Morrisons</option>
                      <option value="Waitrose">Waitrose</option>
                      <option value="Coop">Co-op</option>
                      <option value="M&S">M&S</option>
                      <option value="Ocado">Ocado</option>
                    </select>

                    <select
                      className="w-full p-2 rounded-md border border-gray-300"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as FoodCategory)}
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                      <option value="Meat & Fish">Meat & Fish</option>
                      <option value="Bread & Bakery">Bread & Bakery</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Ready Meals">Ready Meals</option>
                      <option value="Cereals">Cereals</option>
                      <option value="Pasta & Rice">Pasta & Rice</option>
                      <option value="Condiments">Condiments</option>
                      <option value="Frozen Foods">Frozen Foods</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Calories</p>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={nutritionFilters.minCalories}
                          onChange={(e) => setNutritionFilters({...nutritionFilters, minCalories: e.target.value})}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={nutritionFilters.maxCalories}
                          onChange={(e) => setNutritionFilters({...nutritionFilters, maxCalories: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Protein</p>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={nutritionFilters.minProtein}
                          onChange={(e) => setNutritionFilters({...nutritionFilters, minProtein: e.target.value})}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={nutritionFilters.maxProtein}
                          onChange={(e) => setNutritionFilters({...nutritionFilters, maxProtein: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="space-y-4">
                  <div id="barcode-scanner-preview" className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden" />
                  <p className="text-center text-sm text-muted-foreground">
                    Point your camera at a barcode
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsScanning(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Scanning
                  </Button>
                </div>
              )}

              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => onFoodSelect(food)}
                      className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{food.name}</h4>
                          <p className="text-sm text-muted-foreground">{food.brand}</p>
                          <p className="text-xs text-muted-foreground mt-1">{food.category}</p>
                        </div>
                        <span className="text-sm font-medium">
                          {food.calories} kcal
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span>P: {food.protein}g</span>
                        <span className="mx-2">C: {food.carbs}g</span>
                        <span>F: {food.fat}g</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              {isPremium ? (
                <>
                  <Input
                    placeholder="Search custom foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                  
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-4">
                      {filteredCustomFoods.map((food) => (
                        <button
                          key={food.id}
                          onClick={() => handleCustomFoodSelect(food)}
                          className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{food.name}</h4>
                              {food.brand && (
                                <p className="text-sm text-muted-foreground">{food.brand}</p>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {food.calories} kcal
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span>P: {food.protein}g</span>
                            <span className="mx-2">C: {food.carbs}g</span>
                            <span>F: {food.fat}g</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Add New Custom Food</h3>
                    <CustomFoodForm onSuccess={() => setActiveTab("database")} />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">Premium Feature</h3>
                  <p className="text-muted-foreground mb-4">
                    Upgrade to Premium to create and save custom foods
                  </p>
                  <Button>Upgrade to Premium</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
