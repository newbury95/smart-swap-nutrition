
import { useState } from "react";
import { Food } from "./types";
import { FoodSearchBar } from "./FoodSearchBar";
import { FoodFilters } from "./FoodFilters";
import { BarcodeScanner } from "./BarcodeScanner";
import { FoodList } from "./FoodList";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader } from '@zxing/library';

interface FoodDatabaseTabProps {
  foods: Food[];
  onSelect: (food: Food) => void;
}

export const FoodDatabaseTab = ({ foods, onSelect }: FoodDatabaseTabProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] = useState<"all" | Food["supermarket"]>("all");
  const [selectedCategory, setSelectedCategory] = useState<Food["category"]>("All Categories");
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

      const foodItem = foods.find(food => food.barcode === result.getText());
      
      if (foodItem) {
        onSelect(foodItem);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FoodSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => setShowFilters(!showFilters)}
          onBarcodeClick={handleBarcodeScanner}
          isScanning={isScanning}
        />
      </div>

      {showFilters && (
        <FoodFilters
          selectedSupermarket={selectedSupermarket}
          setSelectedSupermarket={setSelectedSupermarket}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          nutritionFilters={nutritionFilters}
          setNutritionFilters={setNutritionFilters}
        />
      )}

      {isScanning ? (
        <BarcodeScanner onCancel={() => setIsScanning(false)} />
      ) : (
        <FoodList foods={foods} onSelect={onSelect} />
      )}
    </div>
  );
};
