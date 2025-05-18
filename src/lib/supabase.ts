
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Get environment variables from the Supabase integration
const supabaseUrl = "https://rjucdyyuowpebzbuixcu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdWNkeXl1b3dwZWJ6YnVpeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDc1MDcsImV4cCI6MjA2MDI4MzUwN30.sRGFEU2wgPArALac085pLDXO6oqwOFWDvOxr2EAdJ3A";

// Create a single Supabase client instance to avoid duplicate auth listeners
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
