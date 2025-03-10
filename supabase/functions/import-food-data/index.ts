
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
    const { foodItems } = await req.json()
    
    if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      throw new Error('No valid food items provided');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Processing ${foodItems.length} food items for import`);

    // Process data
    const data = foodItems.map(item => ({
      food_item: item.name,
      kcal: item.calories || 0,
      protein: item.protein || 0,
      fats: item.fat || 0,
      saturates: item.saturates || 0,
      carbohydrates: item.carbs || 0,
      sugar: item.sugar || 0,
      salt: item.salt || 0,
      calcium: item.calcium || 0,
      serving_size: item.servingSize || "100g",
      provider: item.supermarket || "Generic",
      barcode: item.barcode || null,
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

    // Insert in batches of 100 to avoid timeouts
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(data.length/batchSize)}`);
      const batch = data.slice(i, i + batchSize);
      
      const { data: insertedData, error } = await supabase
        .from('nutritional_info')
        .insert(batch)
        .select('id');
      
      if (error) {
        console.error('Batch insert error:', error);
        throw new Error(`Error inserting batch: ${error.message}`);
      }
      
      results.push(...(insertedData || []));
    }

    console.log(`Successfully imported ${results.length} food items`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Food data successfully imported',
        count: results.length,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
