
import { useState } from "react";
import { Search, Barcode, Plus } from "lucide-react";
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

type Food = {
  id: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  supermarket: "Tesco" | "Sainsburys" | "Asda" | "Morrisons" | "Waitrose";
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
    supermarket: "Tesco"
  },
  // Add more mock foods here
];

export const FoodSelector = ({ onFoodSelect }: FoodSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const filteredFoods = mockFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBarcodeScanner = async () => {
    setIsScanning(true);
    try {
      // Here we would integrate with a barcode scanning library
      // For now, we'll just show a mock implementation
      setTimeout(() => {
        setIsScanning(false);
        // Mock finding a food item by barcode
        onFoodSelect(mockFoods[0]);
      }, 2000);
    } catch (error) {
      setIsScanning(false);
    }
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

          {isScanning && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Scanning barcode...
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
