import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BUCKET_NAMES = ['beats', 'remixes', 'cover_art', 'images'];

// Admin client for privileged storage operations
const supabaseAdminClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getInvokingUserRole(userSupabaseClient: SupabaseClient): Promise<string | null> {
  const { data: { user }, error: userError } = await userSupabaseClient.auth.getUser();
  if (userError || !user) {
    console.error('Error getting invoking user or no user found:', userError?.message);
    return null;
  }

  // Use the admin client to fetch profile, as RLS might prevent user from seeing their own role directly
  // depending on policies. For checking auth, this is more reliable.
  const { data: profile, error: profileError } = await supabaseAdminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching invoking user profile:', profileError?.message);
    return null;
  }
  return profile?.role;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the invoking user's JWT to check their permissions
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', 
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const invokingUserRole = await getInvokingUserRole(userSupabaseClient);

    if (!invokingUserRole || !['admin', 'editor'].includes(invokingUserRole)) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only admins or editors can list storage files.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const allBucketsData = [];

    for (const bucketName of BUCKET_NAMES) {
      const { data: files, error: listError } = await supabaseAdminClient.storage.from(bucketName).list();
      
      if (listError) {
        console.error(`Error listing files from bucket ${bucketName}:`, listError.message);
        // Optionally skip this bucket or return an error for the whole request
        // For now, we'll add an error entry for this bucket
        allBucketsData.push({
          bucketName,
          error: `Failed to list files: ${listError.message}`,
          files: []
        });
        continue;
      }

      const filesWithUrls = files.map(file => {
        const { data: publicUrlData } = supabaseAdminClient.storage.from(bucketName).getPublicUrl(file.name);
        return {
          ...file,
          public_url: publicUrlData.publicUrl,
        };
      });
      
      allBucketsData.push({
        bucketName,
        files: filesWithUrls,
      });
    }

    return new Response(JSON.stringify(allBucketsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error in list-storage-files function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
