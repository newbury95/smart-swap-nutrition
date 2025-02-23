
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const parseNumericField = (value: string): number => {
  // Remove any whitespace and convert commas to dots
  const cleanValue = value.trim().replace(',', '.');
  const number = parseFloat(cleanValue);
  
  if (isNaN(number)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }
  
  return number;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return new Response(
        JSON.stringify({ error: 'File must be a CSV' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const text = await file.text()
    const lines = text.split('\n')
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ error: 'CSV file is empty or invalid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const headers = lines[0].trim().split(',')
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
    ]

    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required columns', 
          missingColumns,
          requiredColumns,
          providedColumns: headers
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const data = []
    const errors = []
    const numericColumns = ['kcal', 'protein', 'fats', 'saturates', 'carbohydrates', 'sugar', 'salt', 'calcium']
    const validProviders = ['Tesco', 'Sainsburys', 'Asda', 'Morrisons', 'Waitrose', 'Coop', 'M&S', 'Ocado']
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      try {
        const values = line.split(',')
        if (values.length !== headers.length) {
          errors.push(`Row ${i}: Invalid number of columns`)
          continue
        }

        const row: Record<string, any> = {}
        
        headers.forEach((header, index) => {
          const value = values[index].trim()
          
          if (numericColumns.includes(header)) {
            try {
              row[header] = parseNumericField(value)
            } catch (error) {
              throw new Error(`Row ${i}, column ${header}: ${error.message}`)
            }
          } else if (header === 'provider') {
            if (!validProviders.includes(value)) {
              throw new Error(`Row ${i}: Invalid provider "${value}". Must be one of: ${validProviders.join(', ')}`)
            }
            row[header] = value
          } else {
            row[header] = value
          }
        })

        data.push(row)
      } catch (error) {
        errors.push(error.message)
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation errors', 
          errors,
          validFormat: `The CSV should have these exact headers: ${requiredColumns.join(', ')}\n` +
                      `Provider must be one of: ${validProviders.join(', ')}\n` +
                      'All numeric columns must contain valid numbers (using either dots or commas as decimal separators)'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { error: insertError } = await supabase
      .from('nutritional_info')
      .insert(data)

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to insert data', details: insertError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'CSV data uploaded successfully', 
        rowsProcessed: data.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
