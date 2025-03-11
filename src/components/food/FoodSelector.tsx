
import { useState, useEffect } from "react";
import { Plus, Crown, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";
import { CustomFoodForm } from "./CustomFoodForm";
import { PremiumFoodDialog } from "./PremiumFoodDialog";
import { FoodDatabaseTab } from "./FoodDatabaseTab";
import { type Food } from "./types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FoodSelectorProps {
  onFoodSelect: (food: Food) => void;
}

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const { isPremium, customFoods, loadCustomFoods, loading: customFoodsLoading } = useSupabase();
  const [activeTab, setActiveTab] = useState("database");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Reload custom foods when the sheet is opened
  useEffect(() => {
    if (isSheetOpen && activeTab === "custom") {
      loadCustomFoods();
    }
  }, [isSheetOpen, activeTab, loadCustomFoods]);

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
      supermarket: "All Supermarkets", // Changed from "Custom" to a valid Supermarket type
      category: "All Categories" // Changed from "Custom Foods" to a valid FoodCategory type
    };
    onFoodSelect(food);
    setIsSheetOpen(false);
  };

  const handleCustomFoodSuccess = () => {
    setShowCustomFoodForm(false);
    loadCustomFoods(); // Reload the custom foods list after adding new food
  };

  const handlePremiumUpgrade = () => {
    setShowPremiumDialog(false);
    // This would normally navigate to premium page, but for now we'll just close the dialog
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                <TabsTrigger value="custom" className="relative">
                  Custom Foods
                  {isPremium && <Crown className="ml-1 h-3 w-3 text-yellow-500" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="database">
                <FoodDatabaseTab onSelect={(food) => {
                  onFoodSelect(food);
                  setIsSheetOpen(false);
                }} />
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                {isPremium ? (
                  <>
                    <Button 
                      onClick={() => setShowCustomFoodForm(true)}
                      className="mb-4 w-full"
                    >
                      Create New Custom Food
                    </Button>
                    
                    {customFoodsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : customFoods?.length > 0 ? (
                      <div className="space-y-2">
                        {customFoods.map((food) => (
                          <Button
                            key={food.id}
                            variant="outline"
                            className="w-full justify-between p-4"
                            onClick={() => handleCustomFoodSelect(food)}
                          >
                            <div className="text-left">
                              <div className="font-medium">{food.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {food.serving_size}
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>
                          No custom foods yet. Create your first one by clicking the button above.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                    <h3 className="font-medium text-lg mb-2">Premium Feature</h3>
                    <p className="text-muted-foreground mb-4">
                      Upgrade to Premium to create and save custom foods
                    </p>
                    <Button onClick={() => handlePremiumUpgrade()} className="bg-yellow-500 hover:bg-yellow-600">
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Custom Food Form Dialog */}
      <Dialog open={showCustomFoodForm} onOpenChange={setShowCustomFoodForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Create Custom Food</DialogTitle>
          <CustomFoodForm onSuccess={handleCustomFoodSuccess} />
        </DialogContent>
      </Dialog>

      <PremiumFoodDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />
    </>
  );
};
