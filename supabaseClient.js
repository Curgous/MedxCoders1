// supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
// Replace with your actual Supabase project info


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
