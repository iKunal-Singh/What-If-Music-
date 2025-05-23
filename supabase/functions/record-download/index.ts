
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecordDownloadPayload {
  itemId: string;
  itemType: 'beat' | 'remix' | 'cover_art';
  email?: string;
  userAgent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get client IP address from request headers
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Parse request body
    const { itemId, itemType, email, userAgent } = await req.json() as RecordDownloadPayload;
    
    console.log(`Recording download for ${itemType} ${itemId} from ${ipAddress}`);
    
    // First, fetch the current downloads count
    const tableName = itemType === 'beat' ? 'beats' : 
                      itemType === 'remix' ? 'remixes' : 'cover_art';
    
    const { data: itemData, error: fetchError } = await supabaseClient
      .from(tableName)
      .select('downloads')
      .eq('id', itemId)
      .single();

    if (fetchError) {
      console.error(`Error fetching current download count:`, fetchError);
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Then update with incremented value
    const currentDownloads = itemData?.downloads || 0;
    const { error: updateError } = await supabaseClient
      .from(tableName)
      .update({ downloads: currentDownloads + 1 })
      .eq('id', itemId);

    if (updateError) {
      console.error(`Error incrementing download count:`, updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Then record the download in the downloads table with the captured IP
    const { error } = await supabaseClient
      .from('downloads')
      .insert({
        item_id: itemId,
        item_type: itemType,
        email: email,
        user_agent: userAgent,
        ip_address: ipAddress
      });

    if (error) {
      console.error('Error recording download:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Download recording failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
