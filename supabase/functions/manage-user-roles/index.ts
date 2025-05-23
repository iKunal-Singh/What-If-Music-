import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const VALID_ROLES = ['admin', 'editor', 'user'];

// Admin client for privileged operations
const supabaseAdminClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use service role key here
);

async function getInvokingUserRole(supabaseClient: SupabaseClient): Promise<string | null> {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    console.error('Error getting invoking user or no user found:', userError);
    return null;
  }

  const { data: profile, error: profileError } = await supabaseAdminClient // Use admin client to check role
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching invoking user profile:', profileError);
    return null;
  }
  return profile?.role;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { targetUserId, newRole } = await req.json();

    if (!targetUserId || !newRole) {
      return new Response(JSON.stringify({ error: 'targetUserId and newRole are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!VALID_ROLES.includes(newRole)) {
      return new Response(JSON.stringify({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Create a Supabase client with the invoking user's JWT to check their permissions
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', // Anon key is fine, JWT takes precedence
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const invokingUserRole = await getInvokingUserRole(userSupabaseClient);

    if (invokingUserRole !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Only admins can manage user roles.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // If invoking user is admin, proceed to update target user's role using the admin client
    const { error: updateError } = await supabaseAdminClient
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update user role', details: updateError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'User role updated successfully', targetUserId, newRole }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error in manage-user-roles function:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
