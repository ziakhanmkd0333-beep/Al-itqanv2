import { createClient } from '@supabase/supabase-js';

// Server-side admin client with service role key (bypasses RLS)
// Only use this in API routes - NEVER expose to client-side
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
