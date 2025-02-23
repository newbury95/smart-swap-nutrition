
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to parse numeric values with specific unit handling
const parseNumericValue = (value: string): number => {
  if (!value || value === 'N/A') return 0;
  
  // Remove any whitespace
  const cleanValue = value.trim();
  
  // Handle special case of "<" values (e.g., "<0.5g")
  if (cleanValue.startsWith('<')) {
    const withoutLessThan = cleanValue.substring(1);
    return parseNumericValue(withoutLessThan);
  }

  // Remove any non-numeric characters except decimal points and minus signs
  const numericPart = cleanValue.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(numericPart);
  
  return isNaN(parsed) ? 0 : parsed;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { csvContent } = await req.json()
    console.log("Received CSV content:", csvContent.substring(0, 200) + "..."); // Log first 200 chars

    if (!csvContent) {
      throw new Error('No CSV content provided');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Split into lines and process
    const lines = csvContent.trim().split('\n');
    console.log(`Processing ${lines.length} lines`);

    // Process header
    const headers = lines[0].trim().split('\t').map(h => h.trim());
    console.log("Headers:", headers);

    // Process data rows
    const data = [];
    const errors = [];

    // Start from index 1 to skip headers
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split('\t').map(v => v.trim());
        if (values.length !== headers.length) {
          throw new Error(`Invalid number of columns`);
        }

        const row = {
          food_item: values[0],
          kcal: parseNumericValue(values[1]),
          protein: parseNumericValue(values[2]),
          fats: parseNumericValue(values[3]),
          saturates: parseNumericValue(values[4]),
          carbohydrates: parseNumericValue(values[5]),
          sugar: parseNumericValue(values[6]),
          salt: parseNumericValue(values[7]),
          calcium: parseNumericValue(values[8]),
          serving_size: values[9],
          provider: values[10],
          created_at: new Date().toISOString()
        };

        console.log(`Row ${i}: Processing`, JSON.stringify(row));
        data.push(row);
      } catch (error) {
        console.error(`Error processing row ${i}:`, error);
        errors.push(`Row ${i}: ${error.message}`);
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found');
    }

    console.log(`Attempting to insert ${data.length} rows`);
    const { error: insertError } = await supabase
      .from('nutritional_info')
      .insert(data);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to insert data: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({
        message: 'CSV data successfully imported',
        rowsProcessed: data.length,
        errors: errors.length > 0 ? errors : undefined
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
        error: error.message,
        details: error.stack
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
