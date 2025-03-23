
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Process the CSV file
    const csvText = await file.text();
    const rows = csvText.split('\n');
    
    // Extract headers (first row) and convert to lowercase
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
    
    // Define required columns
    const requiredColumns = ['name', 'calories', 'protein', 'carbs', 'fat', 'servingsize', 'supermarket'];
    
    // Check if all required columns are present
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required columns', 
          missingColumns,
          requiredColumns,
          providedColumns: headers
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process each row and prepare data for insertion
    const dataToInsert = [];
    const errors = [];
    
    for (let i = 1; i < rows.length; i++) {
      // Skip empty rows
      if (!rows[i].trim()) continue;
      
      const values = rows[i].split(',').map(val => val.trim());
      
      // Skip if values don't match headers
      if (values.length !== headers.length) {
        errors.push(`Row ${i+1}: Column count mismatch. Expected ${headers.length}, got ${values.length}`);
        continue;
      }
      
      // Create an object with the row data
      const rowData = {};
      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j]] = values[j];
      }
      
      // Transform to match nutritional_info table format
      try {
        const transformedData = {
          food_item: String(rowData['name']),
          kcal: parseInt(rowData['calories'], 10) || 0,
          protein: parseFloat(rowData['protein']) || 0,
          fats: parseFloat(rowData['fat']) || 0,
          carbohydrates: parseFloat(rowData['carbs']) || 0,
          sugar: parseFloat(rowData['sugar'] || '0') || 0,
          salt: parseFloat(rowData['salt'] || '0') || 0,
          saturates: parseFloat(rowData['saturates'] || '0') || 0,
          calcium: parseFloat(rowData['calcium'] || '0') || 0,
          serving_size: String(rowData['servingsize'] || '100g'),
          provider: mapProviderName(String(rowData['supermarket'])),
          barcode: rowData['barcode'] || null,
          created_at: new Date().toISOString(),
          calcium_unit: 'mg',
          carbohydrates_unit: 'g',
          fats_unit: 'g',
          kcal_unit: 'kcal',
          protein_unit: 'g',
          salt_unit: 'g',
          saturates_unit: 'g',
          sugar_unit: 'g'
        };
        
        dataToInsert.push(transformedData);
      } catch (error) {
        errors.push(`Row ${i+1}: ${error.message}`);
      }
    }
    
    // If there are errors but also some valid data, we'll insert the valid data
    if (errors.length > 0 && dataToInsert.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid data to insert', errors }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }
    
    // Insert data in batches to avoid timeouts
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < dataToInsert.length; i += batchSize) {
      const batch = dataToInsert.slice(i, i + batchSize);
      const { error } = await supabase.from('nutritional_info').insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
        errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
      } else {
        insertedCount += batch.length;
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        rowsProcessed: insertedCount,
        totalRows: dataToInsert.length,
        errors: errors.length > 0 ? errors : undefined
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
  
  // Default to Generic for any other sources
  return 'Generic';
}
