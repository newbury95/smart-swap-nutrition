
import { useState } from "react";
import { Plus, Crown } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface FoodSelectorProps {
  onFoodSelect: (food: Food) => void;
}

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const navigate = useNavigate();
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

  const handlePremiumUpgrade = () => {
    setShowPremiumDialog(false);
    navigate('/premium-upgrade');
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
                <TabsTrigger value="custom" className="relative">
                  Custom Foods
                  <Crown className="ml-1 h-3 w-3 text-yellow-500" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="database">
                <FoodDatabaseTab onSelect={onFoodSelect} />
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="text-center py-8">
                  {isPremium ? (
                    <>
                      <Button 
                        onClick={() => navigate('/custom-foods')}
                        className="mb-4 w-full"
                      >
                        Create New Custom Food
                      </Button>
                      <div className="space-y-2">
                        {customFoods?.length > 0 ? (
                          customFoods.map((food) => (
                            <Button
                              key={food.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleCustomFoodSelect(food)}
                            >
                              {food.name}
                            </Button>
                          ))
                        ) : (
                          <p className="text-gray-500">No custom foods yet. Create your first one!</p>
                        )}
                      </div>
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
