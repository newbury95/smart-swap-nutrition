
import { useState } from "react";
import { Food, Supermarket, FoodCategory } from "./types";
import { FoodSearchBar } from "./FoodSearchBar";
import { BarcodeScanner } from "./BarcodeScanner";
import { FoodList } from "./FoodList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface FoodDatabaseTabProps {
  onSelect: (food: Food) => void;
}

export const FoodDatabaseTab = ({ onSelect }: FoodDatabaseTabProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const { data: foods = [], isLoading } = useQuery({
    queryKey: ['foods', searchQuery],
    queryFn: async () => {
      let query = supabase.from('nutritional_info').select('*');

      if (searchQuery) {
        query = query.ilike('food_item', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

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
        supermarket: "All Supermarkets" as Supermarket,
        category: "All Categories" as FoodCategory
      }));
    }
  });

  const handleBarcodeScanner = async () => {
    setIsScanning(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <FoodSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBarcodeClick={handleBarcodeScanner}
          isScanning={isScanning}
        />
        <Button 
          variant="outline"
          onClick={() => navigate('/add-custom-food')}
        >
          Add Custom Food
        </Button>
      </div>

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
