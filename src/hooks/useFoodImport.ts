
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturates?: number;
  sugar?: number;
  salt?: number;
  calcium?: number;
  servingSize?: string;
  supermarket: string;
  barcode?: string;
}

interface ImportFoodResult {
  success: boolean;
  message: string;
  count?: number;
  error?: string;
}

export const useFoodImport = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const importFoods = async (foodItems: FoodItem[]): Promise<ImportFoodResult> => {
    if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      return { 
        success: false, 
        message: 'No valid food items provided',
        error: 'No valid food items provided'
      };
    }
    
    setIsImporting(true);
    
    try {
      console.log(`Preparing to import ${foodItems.length} food items`);
      
      // Validate data before sending
      const validFoodItems = foodItems.filter(item => 
        item && typeof item === 'object' && 
        item.name && 
        !isNaN(Number(item.calories)) && 
        !isNaN(Number(item.protein)) && 
        !isNaN(Number(item.carbs)) && 
        !isNaN(Number(item.fat))
      );
      
      if (validFoodItems.length === 0) {
        throw new Error('No valid food items after validation');
      }
      
      if (validFoodItems.length < foodItems.length) {
        console.warn(`Filtered out ${foodItems.length - validFoodItems.length} invalid food items`);
      }
      
      // Get the session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call the Supabase Edge Function
      const response = await supabase.functions.invoke('import-food-data', {
        body: { foodItems: validFoodItems }
      });
      
      console.log('Import function response:', response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to import food data');
      }
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to import food data');
      }
      
      toast({
        title: 'Success',
        description: `Successfully imported ${response.data.count} food items`,
      });
      
      return {
        success: true,
        message: `Successfully imported ${response.data.count} food items`,
        count: response.data.count,
      };
      
    } catch (error: any) {
      console.error('Error importing food data:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to import food data',
      });
      
      return {
        success: false,
        message: 'Failed to import food data',
        error: error.message || 'Unknown error',
      };
    } finally {
      setIsImporting(false);
    }
  };
  
  return {
    importFoods,
    isImporting,
  };
};
