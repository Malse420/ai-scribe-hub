// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://sbbdjeyzqgafzckeoikm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYmRqZXl6cWdhZnpja2VvaWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDcxODgsImV4cCI6MjA0NzY4MzE4OH0.sCHVVIsa2UbUVT7s06qNnjOSpPXWtCy_rDi3zLDKvPM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);