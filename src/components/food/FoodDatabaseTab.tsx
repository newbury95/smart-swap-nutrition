
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
import { AdminFoodImporter } from "./AdminFoodImporter";

interface FoodDatabaseTabProps {
  onSelect: (food: Food) => void;
}

export const FoodDatabaseTab = memo(({ onSelect }: FoodDatabaseTabProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [showAdminImporter, setShowAdminImporter] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin (this is a placeholder - in a real app you'd check roles)
  const checkAdminStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // This is a placeholder. In a real app, you would check user roles
      // For now, we'll just allow any logged-in user to access the admin panel
      setIsAdmin(!!session?.user);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  }, []);

  // Check admin status on component mount
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const { 
    data: foods = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['foods', searchQuery],
    queryFn: async () => {
      try {
        let query = supabase.from('nutritional_info').select(`
          *,
          serving_size_options (
            id,
            description,
            grams,
            is_default
          )
        `);

        if (searchQuery) {
          // Use pattern matching for more flexible search
          query = query.ilike('food_item', `%${searchQuery}%`);
        }

        const { data, error } = await query.limit(50); // Limit for better performance

        if (error) {
          throw error;
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
          supermarket: item.provider as Supermarket || "All Supermarkets" as Supermarket,
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
  };

  const handleRefreshFoods = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Getting the latest food data from the database"
    });
  };

  const handleAdminClose = () => {
    setShowAdminImporter(false);
    // Refresh the foods list to show newly imported foods
    refetch();
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
          
          {isAdmin && (
            <Button 
              variant="outline"
              onClick={() => setShowAdminImporter(true)}
              className="relative"
              title="Food Database Admin"
            >
              <Database className="w-4 h-4" />
            </Button>
          )}
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

      {/* Admin Food Importer Dialog */}
      <Dialog open={showAdminImporter} onOpenChange={handleAdminClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogTitle>Food Database Admin</DialogTitle>
          <AdminFoodImporter />
        </DialogContent>
      </Dialog>
    </div>
  );
});

FoodDatabaseTab.displayName = 'FoodDatabaseTab';
