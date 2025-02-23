
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the CSV file from form data
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if it's a CSV file
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return new Response(
        JSON.stringify({ error: 'File must be a CSV' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Read the file content
    const text = await file.text()
    const lines = text.split('\n')
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ error: 'CSV file is empty or invalid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Parse headers and validate
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

    // Validate headers
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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse and validate data rows
    const data = []
    const errors = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue // Skip empty lines
      
      const values = line.split(',')
      if (values.length !== headers.length) {
        errors.push(`Row ${i}: Invalid number of columns`)
        continue
      }

      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })

      // Validate provider enum value
      const validProviders = ['Tesco', 'Sainsburys', 'Asda', 'Morrisons', 'Waitrose', 'Coop', 'M&S', 'Ocado']
      if (!validProviders.includes(row.provider)) {
        errors.push(`Row ${i}: Invalid provider "${row.provider}". Must be one of: ${validProviders.join(', ')}`)
        return
      }

      // Convert numeric fields
      const numericFields = ['kcal', 'protein', 'fats', 'saturates', 'carbohydrates', 'sugar', 'salt', 'calcium']
      numericFields.forEach(field => {
        row[field] = parseFloat(row[field])
        if (isNaN(row[field])) {
          errors.push(`Row ${i}: Invalid number for ${field}`)
        }
      })

      if (errors.length === 0) {
        data.push(row)
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation errors', errors }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Insert data into the database
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
