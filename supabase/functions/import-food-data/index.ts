
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample fast food data - we'll import a small subset as an example
const fastFoodSample = [
  {
    name: "McDonald's Big Mac",
    calories: 550,
    protein: 25,
    carbs: 45,
    fat: 30,
    saturates: 11,
    sugar: 9,
    salt: 2.3,
    servingSize: "1 burger (219g)",
    supermarket: "McDonald's",
    barcode: "5000000001"
  },
  {
    name: "KFC Original Recipe Chicken Breast",
    calories: 390,
    protein: 39,
    carbs: 11,
    fat: 21,
    saturates: 5,
    sugar: 0,
    salt: 1.9,
    servingSize: "1 piece (162g)",
    supermarket: "KFC",
    barcode: "8000000001"
  },
  {
    name: "Domino's Pepperoni Pizza (1 Slice, Medium)",
    calories: 290,
    protein: 12,
    carbs: 33,
    fat: 12,
    saturates: 5,
    sugar: 3,
    salt: 1.7,
    servingSize: "1 slice (91g)",
    supermarket: "Dominos",
    barcode: "7000000001"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 401 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if fast food data already exists using a more efficient query with IN
    const foodNames = fastFoodSample.map(item => item.name);
    
    const { data: existingData, error: checkError } = await supabase
      .from('nutritional_info')
      .select('food_item')
      .in('food_item', foodNames);

    if (checkError) {
      return new Response(
        JSON.stringify({ error: `Error checking existing data: ${checkError.message}` }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    // If all items already exist, return success
    if (existingData && existingData.length === fastFoodSample.length) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Fast food data already exists in the database',
          existingItems: existingData.length
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Filter out existing items
    const existingItems = existingData ? existingData.map(item => item.food_item) : [];
    const itemsToInsert = fastFoodSample.filter(item => !existingItems.includes(item.name));

    // If there's nothing to insert, return success
    if (itemsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No new items to import',
          existingItems: existingItems.length
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Transform data to match the nutritional_info table schema
    const dataToInsert = itemsToInsert.map(item => ({
      food_item: item.name,
      kcal: item.calories,
      protein: item.protein,
      fats: item.fat,
      carbohydrates: item.carbs,
      sugar: item.sugar || 0,
      salt: item.salt || 0,
      saturates: item.saturates || 0,
      calcium: 0,
      serving_size: item.servingSize,
      provider: mapProviderName(item.supermarket),
      barcode: item.barcode,
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

    // Batch inserts in chunks of 20 for better performance
    const chunkSize = 20;
    const results = [];
    
    for (let i = 0; i < dataToInsert.length; i += chunkSize) {
      const chunk = dataToInsert.slice(i, i + chunkSize);
      const { data, error } = await supabase
        .from('nutritional_info')
        .insert(chunk)
        .select();
        
      if (error) {
        console.error(`Error inserting chunk ${i/chunkSize}:`, error);
        return new Response(
          JSON.stringify({ error: `Error inserting data: ${error.message}` }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
        );
      }
      
      if (data) {
        results.push(...data);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${dataToInsert.length} fast food items`,
        totalItems: existingItems.length + dataToInsert.length,
        importedItems: results.length
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});

// Map supermarket names to valid provider values for the database
function mapProviderName(name: string): string {
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes('tesco')) return 'Tesco';
  if (normalized.includes('sainsbury')) return 'Sainsburys';
  if (normalized.includes('asda')) return 'Asda';
  if (normalized.includes('morrison')) return 'Morrisons';
  if (normalized.includes('waitrose')) return 'Waitrose';
  if (normalized.includes('co-op') || normalized.includes('coop')) return 'Coop';
  if (normalized.includes('marks') || normalized.includes('m&s')) return 'M&S';
  if (normalized.includes('ocado')) return 'Ocado';
  if (normalized.includes('aldi')) return 'Aldi';
  if (normalized.includes('mcdonald')) return 'McDonalds';
  if (normalized.includes('kfc')) return 'KFC';
  if (normalized.includes('burger king')) return 'Burger King';
  if (normalized.includes('subway')) return 'Subway';
  if (normalized.includes('domino')) return 'Dominos';
  if (normalized.includes('pizza hut')) return 'Pizza Hut';
  if (normalized.includes('nando')) return 'Nandos';
  
  // Default to Generic for any other sources
  return 'Generic';
}
