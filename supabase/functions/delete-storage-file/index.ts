import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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
    const { bucketName, filePath } = await req.json();

    if (!bucketName || !filePath) {
      return new Response(JSON.stringify({ error: 'bucketName and filePath are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Create a Supabase client with the invoking user's JWT to check their permissions
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', 
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const invokingUserRole = await getInvokingUserRole(userSupabaseClient);

    if (!invokingUserRole || !['admin', 'editor'].includes(invokingUserRole)) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only admins or editors can delete storage files.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // If authorized, proceed to delete the file using the admin client
    const { error: deleteError } = await supabaseAdminClient.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) {
      console.error(`Error deleting file ${filePath} from bucket ${bucketName}:`, deleteError.message);
      return new Response(JSON.stringify({ error: 'Failed to delete file', details: deleteError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'File deleted successfully', bucketName, filePath }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error in delete-storage-file function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
