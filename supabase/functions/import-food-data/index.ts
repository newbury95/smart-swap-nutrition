
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting food import process");
    const { foodItems } = await req.json()
    
    if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      throw new Error('No valid food items provided');
    }

    console.log(`Received ${foodItems.length} food items for import`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process data - map the imported food items to the database schema
    const data = foodItems.map(item => ({
      food_item: String(item.name).substring(0, 255), // Ensure string and limit length
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

    console.log(`Prepared ${data.length} items for database insertion`);

    // Insert in batches of 50 to avoid timeouts and excessive payload sizes
    const batchSize = 25;
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(data.length/batchSize)} (${batch.length} items)`);
      
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
            results.push(...insertedData);
            successCount += insertedData.length;
          }
        }
      } catch (batchError) {
        console.error('Error processing batch:', batchError);
        errorCount += batch.length;
      }
    }

    console.log(`Import complete. Successfully added ${successCount} items, ${errorCount} failures`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Food data import process completed',
        count: successCount,
        errors: errorCount,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('Error in import-food-data function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error during food import'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
