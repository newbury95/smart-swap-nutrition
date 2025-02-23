
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to parse numeric values with units
const parseNumericWithUnit = (value: string): { value: number; unit: string | null } => {
  // Remove any whitespace and handle empty values
  const cleanValue = value.trim();
  if (!cleanValue) {
    throw new Error('Empty value provided');
  }
  
  // First, try to see if it's just a plain number
  if (!isNaN(Number(cleanValue))) {
    return { value: Number(cleanValue), unit: null };
  }
  
  // If not a plain number, try to parse number with unit
  const match = cleanValue.match(/^(-?\d*\.?\d+)\s*([a-zA-Z%]*)$/);
  
  if (!match) {
    throw new Error(`Invalid value format: "${value}". Expected format: number followed by optional unit`);
  }
  
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
    
    // Process each line of the CSV
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
        
        // Log the raw values for debugging
        console.log(`Processing row ${i}, raw values:`, values);
        
        // Process each column in the row
        headers.forEach((header, index) => {
          const value = values[index].trim();
          
          if (numericColumns.includes(header)) {
            try {
              console.log(`Processing numeric column ${header} with value "${value}"`);
              
              // Parse numeric value and unit
              const { value: numericValue, unit } = parseNumericWithUnit(value);
              
              console.log(`Successfully parsed ${header}: value=${numericValue}, unit=${unit}`);
              
              // Store numeric value and unit separately
              row[header] = numericValue;
              row[`${header}_unit`] = unit;
            } catch (error) {
              throw new Error(`Row ${i}, column ${header}: ${error.message}`);
            }
          } else if (header === 'serving_size') {
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

        console.log(`Processed row ${i} data:`, row);
        data.push(row);
      } catch (error) {
        console.error(`Error processing row ${i}:`, error);
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

    // Insert the data row by row for better error tracking
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      console.log(`Attempting to insert row ${i} into nutritional_info:`, JSON.stringify(row, null, 2));
      
      const { error: insertError } = await supabase
        .from('nutritional_info')
        .insert([row]);

      if (insertError) {
        console.error(`Error inserting row ${i}:`, insertError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to insert data', 
            details: insertError,
            failedRow: row,
            rowIndex: i
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      console.log(`Successfully inserted row ${i}`);
    }

    return new Response(
      JSON.stringify({ 
        message: 'CSV data uploaded successfully', 
        rowsProcessed: data.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

