
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to parse numeric values with units and special cases
const parseNumericWithUnit = (value: string): { value: number; unit: string | null } => {
  // Remove any whitespace
  const cleanValue = value.trim();
  if (!cleanValue) {
    throw new Error('Empty value provided');
  }

  // Handle special case of "<" values
  if (cleanValue.startsWith('<')) {
    const withoutLessThan = cleanValue.substring(1);
    const parsed = parseNumericWithUnit(withoutLessThan);
    return { value: 0.01, unit: parsed.unit };
  }

  // First try to parse as plain number
  if (!isNaN(Number(cleanValue))) {
    return { value: Number(cleanValue), unit: null };
  }

  // Match number followed by optional unit, allowing for mg and g
  const match = cleanValue.match(/^(-?\d*\.?\d+)\s*(mg|g|kcal|%)?$/i);

  if (!match) {
    throw new Error(`Invalid value format: "${value}". Expected format: number followed by optional unit (g, mg, kcal, or %)"`);
  }

  const numericPart = match[1];
  let unit = (match[2] || '').toLowerCase();
  let parsedValue = parseFloat(numericPart);

  // Convert mg to g if needed
  if (unit === 'mg') {
    parsedValue = parsedValue / 1000;
    unit = 'g';
  }

  if (isNaN(parsedValue)) {
    throw new Error(`Invalid numeric value: ${numericPart}`);
  }

  return { value: parsedValue, unit: unit || null };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { csvContent } = await req.json();
    
    if (!csvContent) {
      return new Response(
        JSON.stringify({ error: 'No CSV content provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Split CSV into lines and process headers
    const lines = csvContent.split('\n');
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ error: 'CSV must contain at least headers and one data row' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const headers = lines[0].trim().split(',').map(h => h.trim());
    const requiredColumns = [
      'food_item',
      'kcal',
      'protein',
      'fats',
      'saturates',
      'carbohydrates',
      'sugar',
      'salt',
      'calcium',
      'serving_size',
      'provider'
    ];

    // Validate headers
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Missing required columns: ${missingColumns.join(', ')}`,
          headers: headers 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process data rows
    const data = [];
    const errors = [];
    const validProviders = ['Tesco', 'Sainsburys', 'Asda', 'Morrisons', 'Waitrose', 'Coop', 'M&S', 'Ocado', 'Generic'];

    // Start from index 1 to skip headers
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip empty lines
      if (!line) continue;
      
      try {
        const values = line.split(',').map(v => v.trim());
        if (values.length !== headers.length) {
          errors.push(`Row ${i}: Invalid number of columns`);
          continue;
        }

        const row: Record<string, any> = {};
        
        console.log(`Processing row ${i}, raw values:`, values);
        
        // Process each column in the row
        headers.forEach((header, index) => {
          const value = values[index];

          if (header === 'food_item' || header === 'serving_size') {
            row[header] = value;
          } else if (header === 'provider') {
            if (!validProviders.includes(value)) {
              throw new Error(`Invalid provider: ${value}. Must be one of: ${validProviders.join(', ')}`);
            }
            row[header] = value;
          } else {
            // Handle numeric fields with units
            try {
              const { value: numericValue, unit } = parseNumericWithUnit(value);
              row[header] = numericValue;
              row[`${header}_unit`] = unit;
            } catch (error) {
              throw new Error(`Error parsing ${header}: ${error.message}`);
            }
          }
        });

        data.push(row);
      } catch (error) {
        errors.push(`Row ${i}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation errors found',
          details: errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert data into Supabase
    const { error: insertError } = await supabaseClient
      .from('nutritional_info')
      .insert(data);

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Error inserting data',
          details: insertError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'CSV data successfully imported',
        rowsProcessed: data.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
