import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Admin client for privileged operations
const supabaseAdminClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use service role key here
);

interface InvokingUserInfo {
  id: string;
  role: string | null;
}

async function getInvokingUserInfo(supabaseClient: SupabaseClient): Promise<InvokingUserInfo | null> {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    console.error('Error getting invoking user or no user found:', userError?.message);
    return null;
  }

  const { data: profile, error: profileError } = await supabaseAdminClient // Use admin client to check role reliably
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching invoking user profile:', profileError?.message);
    return null;
  }
  return { id: user.id, role: profile?.role };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return new Response(JSON.stringify({ error: 'targetUserId is required' }), {
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

    const invokingUserInfo = await getInvokingUserInfo(userSupabaseClient);

    if (!invokingUserInfo) {
        return new Response(JSON.stringify({ error: 'Failed to identify invoking user.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        });
    }
    
    if (invokingUserInfo.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Only admins can delete users.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    if (invokingUserInfo.id === targetUserId) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admins cannot delete themselves.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // If invoking user is admin and not deleting themselves, proceed with deletion
    // 1. Delete from public.profiles
    const { error: profileDeleteError } = await supabaseAdminClient
      .from('profiles')
      .delete()
      .eq('id', targetUserId);

    if (profileDeleteError) {
      // Log error but attempt to delete from auth.users anyway, as profile might not exist or RLS might interfere
      // if not using service role for some reason (though we are).
      console.warn('Error deleting user profile (continuing to auth user deletion):', profileDeleteError.message);
      // Depending on strictness, you might choose to return an error here.
      // For this implementation, we'll attempt auth.users deletion even if profile deletion fails.
    }

    // 2. Delete from auth.users
    const { error: authUserDeleteError } = await supabaseAdminClient.auth.admin.deleteUser(targetUserId);

    if (authUserDeleteError) {
      console.error('Error deleting user from auth.users:', authUserDeleteError.message);
      // This is a more critical error. If profile was deleted but auth user wasn't, we have an orphaned profile (or vice-versa).
      // The primary failure point for the user being "deleted" is the auth.users deletion.
      return new Response(JSON.stringify({ error: 'Failed to delete user from authentication system.', details: authUserDeleteError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully', targetUserId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error in delete-user function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
