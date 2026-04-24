import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Generic Supabase client for Server Actions and APIs (Not for sensitive admin actions, unless using Service Role Key)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Use this only when you need Server-level privilege bypassing RLS
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  return createClient(supabaseUrl, serviceKey);
};
