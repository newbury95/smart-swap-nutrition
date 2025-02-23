
import { useState } from "react";
import { Food } from "./types";
import { FoodSearchBar } from "./FoodSearchBar";
import { FoodFilters } from "./FoodFilters";
import { BarcodeScanner } from "./BarcodeScanner";
import { FoodList } from "./FoodList";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FoodDatabaseTabProps {
  foods: Food[];
  onSelect: (food: Food) => void;
}

export const FoodDatabaseTab = ({ onSelect }: FoodDatabaseTabProps) => {
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

  const { data: foods = [], isLoading } = useQuery({
    queryKey: ['foods', searchQuery, selectedSupermarket, selectedCategory, nutritionFilters],
    queryFn: async () => {
      let query = supabase.from('nutritional_info').select('*');

      // Apply search filter if query exists
      if (searchQuery) {
        query = query.ilike('food_item', `%${searchQuery}%`);
      }

      // Apply nutrition filters
      if (nutritionFilters.minCalories) {
        query = query.gte('kcal', parseFloat(nutritionFilters.minCalories));
      }
      if (nutritionFilters.maxCalories) {
        query = query.lte('kcal', parseFloat(nutritionFilters.maxCalories));
      }
      if (nutritionFilters.minProtein) {
        query = query.gte('protein', parseFloat(nutritionFilters.minProtein));
      }
      if (nutritionFilters.maxProtein) {
        query = query.lte('protein', parseFloat(nutritionFilters.maxProtein));
      }
      if (nutritionFilters.minCarbs) {
        query = query.gte('carbohydrates', parseFloat(nutritionFilters.minCarbs));
      }
      if (nutritionFilters.maxCarbs) {
        query = query.lte('carbohydrates', parseFloat(nutritionFilters.maxCarbs));
      }
      if (nutritionFilters.minFat) {
        query = query.gte('fats', parseFloat(nutritionFilters.minFat));
      }
      if (nutritionFilters.maxFat) {
        query = query.lte('fats', parseFloat(nutritionFilters.maxFat));
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Convert nutritional_info data to Food type
      return data.map(item => ({
        id: item.id,
        name: item.food_item,
        brand: "",
        calories: Math.round(item.kcal),
        protein: Number(item.protein),
        carbs: Number(item.carbohydrates),
        fat: Number(item.fats),
        servingSize: item.serving_size,
        barcode: item.barcode || undefined,
        supermarket: "All Supermarkets",
        category: "All Categories"
      }));
    }
  });

  const handleBarcodeScanner = async () => {
    setIsScanning(true);
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
        <BarcodeScanner 
          onCancel={() => setIsScanning(false)} 
          onFoodFound={onSelect}
        />
      ) : (
        <FoodList foods={foods} onSelect={onSelect} isLoading={isLoading} />
      )}
    </div>
  );
};
