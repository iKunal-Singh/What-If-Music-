
import { createClient } from '@supabase/supabase-js';

// Get environment variables from the Supabase integration
const supabaseUrl = "https://rjucdyyuowpebzbuixcu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdWNkeXl1b3dwZWJ6YnVpeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDc1MDcsImV4cCI6MjA2MDI4MzUwN30.sRGFEU2wgPArALac085pLDXO6oqwOFWDvOxr2EAdJ3A";

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
