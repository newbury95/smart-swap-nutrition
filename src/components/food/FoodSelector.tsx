import { useState, useEffect } from "react";
import { Search, Barcode, Plus, X } from "lucide-react";
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

type Supermarket = "Tesco" | "Sainsburys" | "Asda" | "Morrisons" | "Waitrose" | "Coop" | "M&S" | "Ocado";

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
};

interface FoodSelectorProps {
  onFoodSelect: (food: Food) => void;
}

// Extended mock database with more real products
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
    supermarket: "Tesco"
  },
  {
    id: "2",
    name: "Greek Style Yogurt",
    brand: "Sainsburys",
    calories: 133,
    protein: 5.2,
    carbs: 4.7,
    fat: 10.2,
    servingSize: "100g",
    barcode: "7874236589120",
    supermarket: "Sainsburys"
  },
  {
    id: "3",
    name: "Free Range Eggs",
    brand: "Asda",
    calories: 72,
    protein: 6.5,
    carbs: 0,
    fat: 5.1,
    servingSize: "1 egg (58g)",
    barcode: "5051413584726",
    supermarket: "Asda"
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
    supermarket: "Waitrose"
  },
  {
    id: "5",
    name: "British Chicken Breast",
    brand: "M&S",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: "100g",
    barcode: "7891234567890",
    supermarket: "M&S"
  },
  {
    id: "6",
    name: "Wholemeal Bread",
    brand: "Co-op",
    calories: 93,
    protein: 4.1,
    carbs: 15.6,
    fat: 1.2,
    servingSize: "1 slice (40g)",
    barcode: "5060075960124",
    supermarket: "Coop"
  },
  {
    id: "7",
    name: "Scottish Salmon Fillet",
    brand: "Ocado",
    calories: 208,
    protein: 20.4,
    carbs: 0,
    fat: 13.8,
    servingSize: "100g",
    barcode: "5000436889195",
    supermarket: "Ocado"
  },
  {
    id: "8",
    name: "Extra Virgin Olive Oil",
    brand: "Morrisons",
    calories: 824,
    protein: 0,
    carbs: 0,
    fat: 91.6,
    servingSize: "100ml",
    barcode: "5010251543217",
    supermarket: "Morrisons"
  },
  {
    id: "9",
    name: "Hovis Soft White Medium Bread",
    brand: "Hovis",
    calories: 95,
    protein: 3.7,
    carbs: 17.9,
    fat: 0.9,
    servingSize: "1 slice (40g)",
    barcode: "5010043001135",
    supermarket: "Tesco"
  },
  {
    id: "10",
    name: "Pure Organic Coconut Water",
    brand: "Innocent",
    calories: 19,
    protein: 0,
    carbs: 4.4,
    fat: 0,
    servingSize: "100ml",
    barcode: "5060134521432",
    supermarket: "Sainsburys"
  },
  {
    id: "11",
    name: "Highland Spring Still Water",
    brand: "Highland Spring",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: "100ml",
    barcode: "5012034001156",
    supermarket: "Morrisons"
  },
  {
    id: "12",
    name: "Greek Style Natural Yogurt",
    brand: "Fage",
    calories: 97,
    protein: 9.2,
    carbs: 3.2,
    fat: 5,
    servingSize: "100g",
    barcode: "5201054005661",
    supermarket: "Waitrose"
  }
];

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const { toast } = useToast();
  const { isPremium, customFoods, loading: supabaseLoading } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | "all">("all");
  const [activeTab, setActiveTab] = useState("database");
  
  const filteredFoods = mockFoods.filter(food => {
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupermarket = selectedSupermarket === "all" || food.supermarket === selectedSupermarket;
    return matchesSearch && matchesSupermarket;
  });

  const filteredCustomFoods = customFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBarcodeScanner = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();

    try {
      // Get video input devices
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast({
          variant: "destructive",
          title: "No camera found",
          description: "Please ensure you have a camera connected and have granted permission.",
        });
        return;
      }

      // Create a preview element
      const previewEl = document.createElement('video');
      previewEl.className = 'w-full h-64 object-cover rounded-lg';
      const previewContainer = document.getElementById('barcode-scanner-preview');
      if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.appendChild(previewEl);
      }

      // Start scanning
      const result = await codeReader.decodeOnceFromConstraints(
        { video: { facingMode: 'environment' } },
        previewEl
      );

      // Look up the food item by barcode
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
      supermarket: "Tesco" // Default value for custom foods
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
                  onClick={handleBarcodeScanner}
                  disabled={isScanning}
                >
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>

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
