// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xbzuezdejyekhxwtyqrg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhienVlemRlanlla2h4d3R5cXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDIzNzEsImV4cCI6MjA1NTU3ODM3MX0.gS15OLH8bTxkG625G2qWkj1e3OF6Nc3DEg67Thh61OA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);