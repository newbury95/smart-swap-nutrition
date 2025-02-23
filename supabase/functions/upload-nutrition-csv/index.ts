import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to parse numeric values with units
const parseNumericWithUnit = (value: string): { value: number; unit: string | null } => {
  // Remove any whitespace
  const cleanValue = value.trim();
  
  // Extract the numeric part and unit using regex
  // This will match numbers (including decimals) followed by optional units
  const match = cleanValue.match(/^([\d.]+)([a-zA-Z%]*)$/);
  
  if (!match) {
    throw new Error(`Invalid value format: ${value}. Expected format: number followed by optional unit`);
  }
  
  // First capture group is the number, second is the unit (if any)
  const numericPart = match[1];
  const unit = match[2] || null;
  
  const parsedValue = parseFloat(numericPart);
  
  if (isNaN(parsedValue)) {
    throw new Error(`Invalid numeric value: ${numericPart}`);
  }
  
  return { value: parsedValue, unit };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return new Response(
        JSON.stringify({ error: 'File must be a CSV' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split('\n');
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ error: 'CSV file is empty or invalid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const headers = lines[0].trim().split(',');
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

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required columns', 
          missingColumns,
          requiredColumns,
          providedColumns: headers
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const data = [];
    const errors = [];
    const numericColumns = [
      'kcal',
      'protein',
      'fats',
      'saturates',
      'carbohydrates',
      'sugar',
      'salt',
      'calcium'
    ];
    const validProviders = ['Tesco', 'Sainsburys', 'Asda', 'Morrisons', 'Waitrose', 'Coop', 'M&S', 'Ocado'];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const values = line.split(',');
        if (values.length !== headers.length) {
          errors.push(`Row ${i}: Invalid number of columns`);
          continue;
        }

        const row: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          const value = values[index].trim();
          
          if (numericColumns.includes(header)) {
            try {
              // Parse numeric value and unit
              const { value: numericValue, unit } = parseNumericWithUnit(value);
              row[header] = numericValue;
              row[`${header}_unit`] = unit;
              console.log(`Parsed ${header}: value = ${numericValue}, unit = ${unit}`);
            } catch (error) {
              throw new Error(`Row ${i}, column ${header}: ${error.message}`);
            }
          } else if (header === 'serving_size') {
            // For serving_size, keep the original format as it's stored as text
            row[header] = value;
          } else if (header === 'provider') {
            if (!validProviders.includes(value)) {
              throw new Error(`Row ${i}: Invalid provider "${value}". Must be one of: ${validProviders.join(', ')}`);
            }
            row[header] = value;
          } else {
            row[header] = value;
          }
        });

        data.push(row);
        console.log(`Processed row ${i}:`, row);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation errors', 
          errors,
          validFormat: `The CSV should have these exact headers: ${requiredColumns.join(', ')}\n` +
                      `Provider must be one of: ${validProviders.join(', ')}\n` +
                      'All numeric values should be in format: number followed by optional unit (e.g., 100g, 5mg, 12)'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from('nutritional_info')
      .insert(data);

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert data', details: insertError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'CSV data uploaded successfully', 
        rowsProcessed: data.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
