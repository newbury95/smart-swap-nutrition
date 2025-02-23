import { useState } from "react";
import { Search, Barcode, Plus, Filter } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";
import { CustomFoodForm } from "./CustomFoodForm";
import { BarcodeScanner } from "./BarcodeScanner";
import { FoodFilters } from "./FoodFilters";
import { FoodList } from "./FoodList";
import {
  type Food,
  type FoodCategory,
  type Supermarket,
  type NutritionFilters
} from "./types";
import { mockFoods } from "./mockFoods";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FoodSelectorProps {
  onFoodSelect: (food: Food) => void;
}

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const { toast } = useToast();
  const { isPremium, customFoods } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket>("All Supermarkets");
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>("All Categories");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("database");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [nutritionFilters, setNutritionFilters] = useState<NutritionFilters>({
    minCalories: "",
    maxCalories: "",
    minProtein: "",
    maxProtein: "",
    minCarbs: "",
    maxCarbs: "",
    minFat: "",
    maxFat: "",
  });

  const allFoods = [...mockFoods, ...customFoods.map(cf => ({
    id: cf.id,
    name: cf.name,
    brand: cf.brand || "",
    calories: cf.calories,
    protein: cf.protein,
    carbs: cf.carbs,
    fat: cf.fat,
    servingSize: cf.serving_size,
    supermarket: "All Supermarkets" as Supermarket,
    category: "All Categories" as FoodCategory
  }))];

  const filteredFoods = allFoods.filter(food => {
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupermarket = selectedSupermarket === "All Supermarkets" || food.supermarket === selectedSupermarket;
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

      const foodItem = allFoods.find(food => food.barcode === result.getText());
      
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
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    const food: Food = {
      id: customFood.id,
      name: customFood.name,
      brand: customFood.brand || "",
      calories: customFood.calories,
      protein: customFood.protein,
      carbs: customFood.carbs,
      fat: customFood.fat,
      servingSize: customFood.serving_size,
      supermarket: "All Supermarkets",
      category: "All Categories"
    };
    onFoodSelect(food);
  };

  const handleSupermarketChange = (value: Supermarket) => {
    setSelectedSupermarket(value);
  };

  return (
    <>
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
                <TabsTrigger value="custom">
                  Custom Foods
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
                  <FoodFilters
                    selectedSupermarket={selectedSupermarket}
                    setSelectedSupermarket={handleSupermarketChange}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    nutritionFilters={nutritionFilters}
                    setNutritionFilters={setNutritionFilters}
                  />
                )}

                {isScanning ? (
                  <BarcodeScanner onCancel={() => setIsScanning(false)} />
                ) : (
                  <FoodList foods={filteredFoods} onSelect={onFoodSelect} />
                )}
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="text-center py-8">
                  {isPremium ? (
                    <CustomFoodForm onSuccess={() => setActiveTab("database")} />
                  ) : (
                    <>
                      <h3 className="font-medium text-lg mb-2">Premium Feature</h3>
                      <p className="text-muted-foreground mb-4">
                        Upgrade to Premium to create and save custom foods
                      </p>
                      <Button onClick={() => setShowPremiumDialog(true)}>
                        Upgrade to Premium
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Get access to custom food creation and more premium features by upgrading your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Maybe Later
            </Button>
            <Button onClick={() => {
              setShowPremiumDialog(false);
            }}>
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
