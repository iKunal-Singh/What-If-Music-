
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create storage buckets if they don't exist
    await createBucketsIfNotExist(supabase);

    // Insert sample data
    await insertSampleData(supabase);

    return new Response(
      JSON.stringify({ success: true, message: "Setup completed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function createBucketsIfNotExist(supabase) {
  // List of buckets to create
  const buckets = [
    { name: "beats", public: true },
    { name: "remixes", public: true },
    { name: "cover_art", public: true },
  ];

  for (const bucket of buckets) {
    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets.some(
      (b) => b.name === bucket.name
    );

    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
      });

      if (error) {
        throw new Error(`Failed to create bucket ${bucket.name}: ${error.message}`);
      }
    }
  }
}

async function insertSampleData(supabase) {
  // Check if we already have data
  const { data: existingBeats } = await supabase
    .from("beats")
    .select("id")
    .limit(1);

  if (existingBeats && existingBeats.length > 0) {
    // We already have data, so don't insert anything
    return;
  }

  // Sample beats data
  const beats = [
    {
      title: "Midnight Groove",
      producer: "JazzMaster",
      bpm: 90,
      key: "Fm",
      tags: ["jazz", "lofi", "chill"],
      description: "A smooth jazz-inspired beat with lofi elements",
      image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      audio_url: "https://example.com/midnight-groove.mp3",
    },
    {
      title: "Trap Anthem",
      producer: "BeatKing",
      bpm: 140,
      key: "Gm",
      tags: ["trap", "hip-hop", "dark"],
      description: "Hard-hitting trap beat with thunderous 808s",
      image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      audio_url: "https://example.com/trap-anthem.mp3",
    },
    {
      title: "Summer Vibes",
      producer: "WaveMaker",
      bpm: 105,
      key: "C",
      tags: ["pop", "summer", "upbeat"],
      description: "Uplifting pop beat perfect for summer hits",
      image_url: "https://images.unsplash.com/photo-1534470497963-262653bed0fd",
      audio_url: "https://example.com/summer-vibes.mp3",
    },
  ];

  // Sample remixes data
  const remixes = [
    {
      title: "Higher Love (Club Remix)",
      remixer: "DJ Pulse",
      original_artist: "Whitney Houston",
      youtube_id: "JR49dyo-y0E",
      tags: ["house", "vocal", "classic"],
      description: "House remix of the Whitney Houston classic",
    },
    {
      title: "Blinding Lights (Dark Edition)",
      remixer: "NightShift",
      original_artist: "The Weeknd",
      youtube_id: "4NRXx6U8ABQ",
      tags: ["synthwave", "dark", "electronic"],
      description: "Dark synthwave take on The Weeknd's hit",
    },
    {
      title: "Bad Guy (Trap Flip)",
      remixer: "808Master",
      original_artist: "Billie Eilish",
      youtube_id: "DyDfgMOUjCI",
      tags: ["trap", "electronic", "flip"],
      description: "Trap-infused version of Billie's chart-topper",
    },
  ];

  // Sample cover art data
  const coverArt = [
    {
      title: "Neon Dreams",
      artist: "VisualWave",
      image_url: "https://images.unsplash.com/photo-1614149162883-504ce46d8a80",
      tags: ["neon", "synthwave", "retro"],
    },
    {
      title: "Urban Soul",
      artist: "CityArtist",
      image_url: "https://images.unsplash.com/photo-1547149600-a6eee679a88a",
      tags: ["urban", "portrait", "dark"],
    },
    {
      title: "Nature's Harmony",
      artist: "EcoVision",
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      tags: ["nature", "ambient", "peaceful"],
    },
  ];

  // Insert sample data into the database
  const { error: beatsError } = await supabase.from("beats").insert(beats);
  if (beatsError) throw new Error(`Error inserting beats: ${beatsError.message}`);

  const { error: remixesError } = await supabase.from("remixes").insert(remixes);
  if (remixesError) throw new Error(`Error inserting remixes: ${remixesError.message}`);

  const { error: coverArtError } = await supabase.from("cover_art").insert(coverArt);
  if (coverArtError) throw new Error(`Error inserting cover art: ${coverArtError.message}`);
}
