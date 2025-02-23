
import { useState } from "react";
import { Plus } from "lucide-react";
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

interface FoodSelectorProps {
  onFoodSelect: (food: Food) => void;
}

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const { isPremium, customFoods } = useSupabase();
  const [activeTab, setActiveTab] = useState("database");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

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
                <TabsTrigger value="custom">Custom Foods</TabsTrigger>
              </TabsList>

              <TabsContent value="database">
                <FoodDatabaseTab onSelect={onFoodSelect} />
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

      <PremiumFoodDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
      />
    </>
  );
};

