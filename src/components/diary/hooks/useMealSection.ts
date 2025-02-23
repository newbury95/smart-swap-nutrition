
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Food } from "@/components/food/types";

export const useMealSection = () => {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchFoods = async (query: string) => {
    console.log('Searching foods with query:', query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('nutritional_info')
        .select('*')
        .textSearch('search_text', query)
        .limit(10);

      if (error) {
        console.error('Error searching foods:', error);
        toast({
          title: "Search failed",
          description: "Could not search for foods. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Search results:', data);

      if (!data || data.length === 0) {
        toast({
          title: "No results",
          description: "No foods found matching your search.",
        });
        setSearchResults([]);
        return;
      }

      const foods: Food[] = data.map(item => ({
        id: item.id,
        name: item.food_item,
        calories: item.kcal,
        protein: item.protein,
        carbs: item.carbohydrates,
        fat: item.fats,
        servingSize: item.serving_size,
        brand: "",
        supermarket: "All Supermarkets",
        category: "All Categories",
        barcode: item.barcode || undefined
      }));

      setSearchResults(foods);
    } catch (error) {
      console.error('Error searching foods:', error);
      toast({
        title: "Search failed",
        description: "Could not search for foods. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    toast,
    searchResults,
    isSearching,
    searchFoods,
    setSearchResults
  };
};
