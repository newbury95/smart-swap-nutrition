
import { useState, useCallback, memo, useEffect } from "react";
import { Food, Supermarket, FoodCategory } from "./types";
import { FoodSearchBar } from "./FoodSearchBar";
import { BarcodeScanner } from "./BarcodeScanner";
import { FoodList } from "./FoodList";
import { Button } from "@/components/ui/button";
import { Crown, Database, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CustomFoodForm } from "./CustomFoodForm";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

interface FoodDatabaseTabProps {
  onSelect: (food: Food) => void;
}

export const FoodDatabaseTab = memo(({ onSelect }: FoodDatabaseTabProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query to reduce database queries
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const { 
    data: foods = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['foods', debouncedQuery, forceRefresh],
    queryFn: async () => {
      try {
        let query = supabase.from('nutritional_info').select(`
          id,
          food_item,
          provider,
          kcal,
          protein,
          fats,
          carbohydrates,
          serving_size,
          barcode,
          serving_size_options (
            id,
            description,
            grams,
            is_default
          )
        `);

        if (debouncedQuery) {
          // Use pattern matching for more flexible search
          query = query.ilike('food_item', `%${debouncedQuery}%`);
        }

        // Limit results to improve performance
        const { data, error } = await query.order('food_item', { ascending: true }).limit(50);

        if (error) {
          throw error;
        }

        // Make sure we have data
        if (!data || data.length === 0) {
          console.log("No foods found in database");
          return [];
        }

        return data.map(item => ({
          id: item.id,
          name: item.food_item,
          brand: item.provider || "",
          calories: Math.round(item.kcal),
          protein: Number(item.protein),
          carbs: Number(item.carbohydrates),
          fat: Number(item.fats),
          servingSize: item.serving_size,
          barcode: item.barcode || undefined,
          supermarket: item.provider as Supermarket || "Generic" as Supermarket,
          category: "All Categories" as FoodCategory,
          servingSizeOptions: item.serving_size_options || []
        }));
      } catch (error) {
        console.error("Error fetching foods:", error);
        toast({
          variant: "destructive",
          title: "Error fetching foods",
          description: "Please try again later"
        });
        return [];
      }
    },
    staleTime: 60000, // 1 minute
  });

  const handleBarcodeScanner = useCallback(() => {
    setIsScanning(true);
  }, []);

  const handleFoodSelect = useCallback((food: Food) => {
    onSelect(food);
    // Close scanner if it was open
    setIsScanning(false);
  }, [onSelect]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleCustomFoodSuccess = () => {
    setShowCustomFoodForm(false);
    toast({
      title: "Success",
      description: "Custom food created successfully"
    });
    // Refresh foods list
    refetch();
  };

  const handleRefreshFoods = () => {
    setForceRefresh(prev => prev + 1);
    toast({
      title: "Refreshing",
      description: "Getting the latest food data from the database"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <FoodSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBarcodeClick={handleBarcodeScanner}
          onClear={handleSearchClear}
          isScanning={isScanning}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshFoods}
            size="icon"
            title="Refresh food database"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowCustomFoodForm(true)}
            className="relative"
          >
            Add Custom Food
            <Crown className="w-4 h-4 text-yellow-500 absolute -top-2 -right-2" />
          </Button>
        </div>
      </div>

      {isScanning ? (
        <BarcodeScanner 
          onCancel={() => setIsScanning(false)} 
          onFoodFound={handleFoodSelect}
        />
      ) : isLoading ? (
        <SkeletonLoader type="list" count={5} />
      ) : (
        <FoodList 
          foods={foods} 
          onSelect={handleFoodSelect} 
          isLoading={isLoading} 
        />
      )}

      {/* Custom Food Form Dialog */}
      <Dialog open={showCustomFoodForm} onOpenChange={setShowCustomFoodForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Create Custom Food</DialogTitle>
          <CustomFoodForm onSuccess={handleCustomFoodSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
});

FoodDatabaseTab.displayName = 'FoodDatabaseTab';
