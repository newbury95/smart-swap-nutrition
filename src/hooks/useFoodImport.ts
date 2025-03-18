
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
      
      // Check first if foods already exist to avoid duplicates
      const { data: existingFoods, error: checkError } = await supabase
        .from('nutritional_info')
        .select('food_item')
        .in('food_item', validFoodItems.map(item => item.name));
      
      if (checkError) {
        console.error('Error checking existing foods:', checkError);
        throw new Error('Failed to check for existing foods');
      }
      
      const existingFoodNames = new Set((existingFoods || []).map(f => f.food_item));
      
      // Filter out foods that already exist
      const newFoodItems = validFoodItems.filter(item => !existingFoodNames.has(item.name));
      
      if (newFoodItems.length === 0) {
        return {
          success: true,
          message: 'All foods already exist in the database',
          count: 0
        };
      }
      
      console.log(`Importing ${newFoodItems.length} new food items (${existingFoodNames.size} already exist)`);
      
      // Map the data to match the database schema
      const foodsToInsert = newFoodItems.map(item => ({
        food_item: String(item.name).substring(0, 255),
        kcal: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        fats: Number(item.fat) || 0,
        saturates: Number(item.saturates) || 0,
        carbohydrates: Number(item.carbs) || 0,
        sugar: Number(item.sugar) || 0,
        salt: Number(item.salt) || 0,
        calcium: Number(item.calcium) || 0,
        serving_size: String(item.servingSize || "100g").substring(0, 50),
        provider: String(item.supermarket || "Generic").substring(0, 50),
        barcode: item.barcode ? String(item.barcode) : null,
        created_at: new Date().toISOString(),
        calcium_unit: 'mg',
        carbohydrates_unit: 'g',
        fats_unit: 'g',
        kcal_unit: 'kcal',
        protein_unit: 'g',
        salt_unit: 'g',
        saturates_unit: 'g',
        sugar_unit: 'g'
      }));

      // Insert in batches to avoid timeouts and excessive payload sizes
      const batchSize = 20;
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < foodsToInsert.length; i += batchSize) {
        const batch = foodsToInsert.slice(i, i + batchSize);
        console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(foodsToInsert.length/batchSize)} (${batch.length} items)`);
        
        try {
          const { data: insertedData, error } = await supabase
            .from('nutritional_info')
            .insert(batch)
            .select('id');
          
          if (error) {
            console.error('Batch insert error:', error);
            errorCount += batch.length;
          } else {
            if (insertedData) {
              console.log(`Successfully inserted ${insertedData.length} items in this batch`);
              successCount += insertedData.length;
            }
          }
        } catch (batchError) {
          console.error('Error processing batch:', batchError);
          errorCount += batch.length;
        }
      }

      console.log(`Import complete. Successfully added ${successCount} items, ${errorCount} failures`);
      
      if (successCount > 0) {
        toast({
          title: 'Success',
          description: `Successfully imported ${successCount} food items to your database`,
        });
        
        return {
          success: true,
          message: `Successfully imported ${successCount} food items to your database`,
          count: successCount,
        };
      } else if (existingFoodNames.size > 0) {
        return {
          success: true,
          message: `All foods already exist in the database (${existingFoodNames.size} items)`,
          count: 0,
        };
      } else {
        throw new Error('Failed to import any food items');
      }
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
