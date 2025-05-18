
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
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'beatwave'
    },
  }
});

// Check if we have storage buckets initialized
export const initializeStorage = async () => {
  try {
    // Check if storage buckets exist, create if they don't
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const requiredBuckets = ['beats', 'images', 'remixes'];
    for (const bucket of requiredBuckets) {
      if (!buckets?.find(b => b.name === bucket)) {
        console.log(`Creating storage bucket: ${bucket}`);
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize storage buckets:', error);
    return false;
  }
};

// Initialize storage when this module is imported
initializeStorage().catch(console.error);
