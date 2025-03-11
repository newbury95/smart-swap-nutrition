
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
    setIsImporting(true);
    
    try {
      console.log(`Starting import of ${foodItems.length} food items`);
      
      // Get the function URL from the environment
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-food-data`;
      
      // Get the authorization token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session ? `Bearer ${session.access_token}` : '';
      
      // Log the function URL and token status
      console.log(`Function URL: ${functionUrl}`);
      console.log(`Auth token available: ${!!token}`);
      
      // Call the Supabase Edge Function
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ foodItems }),
      });
      
      console.log(`Response status: ${response.status}`);
      
      const result = await response.json();
      console.log('Import result:', result);
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to import food data');
      }
      
      toast({
        title: 'Success',
        description: `Successfully imported ${result.count} food items`,
      });
      
      return {
        success: true,
        message: `Successfully imported ${result.count} food items`,
        count: result.count,
      };
      
    } catch (error) {
      console.error('Error importing food data:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to import food data',
      });
      
      return {
        success: false,
        message: 'Failed to import food data',
        error: error.message,
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
