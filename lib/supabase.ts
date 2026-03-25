import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if environment variables are available
// This prevents build errors on Vercel when env vars aren't set
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }) }
    } as any;

export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    } as any;
